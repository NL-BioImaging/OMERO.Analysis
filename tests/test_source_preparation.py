from concurrent.futures import ThreadPoolExecutor
from threading import Event, Lock
from types import SimpleNamespace
import pytest
from omero_analysis.data_query import DataQueryBroker
from omero_analysis.errors import RemoteQueryFailed


@pytest.fixture
def broker_settings(settings,tmp_path):
    settings.OMERO_ANALYSIS_STATE_DIR=str(tmp_path)
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_URL="http://worker.invalid"
    settings.OMERO_ANALYSIS_DATA_QUERY_WORKER_TOKEN="test-only"


def test_parallel_inspector_and_compatibility_requests_upload_exact_source_once(broker_settings,monkeypatch):
    entered,second_resolved,finish=Event(),Event(),Event()
    guard=Lock();state={"cached":False,"resolves":0,"uploads":0,"streams":0}
    def request(self,method,path,**kwargs):
        if path.endswith("resolve"):
            with guard:
                state["resolves"]+=1
                if state["resolves"]>=3:second_resolved.set()
                return {"cached":state["cached"],"source":{"source_id":"shared"}}
        with guard:state["uploads"]+=1
        entered.set();assert finish.wait(5)
        kwargs["data"].read()
        with guard:state["cached"]=True
        return {"source_id":"shared"}
    monkeypatch.setattr(DataQueryBroker,"_request",request)
    def chunks():
        state["streams"]+=1;yield b"data"
    annotation=SimpleNamespace(getFileInChunks=chunks)
    info=SimpleNamespace(name="data.csv",size=4,mimetype="text/csv")
    def prepare():return DataQueryBroker()._source(annotation,info,"same-scope","same-source")
    with ThreadPoolExecutor(max_workers=2) as pool:
        first=pool.submit(prepare);assert entered.wait(5)
        second=pool.submit(prepare);assert second_resolved.wait(5)
        finish.set()
        assert first.result(timeout=5)==second.result(timeout=5)=={"source_id":"shared"}
    assert state["uploads"]==state["streams"]==1


def test_admission_failure_rechecks_cache_without_reuploading_completed_source(broker_settings,monkeypatch):
    state={"busy":False,"uploads":0}
    broker=DataQueryBroker()
    def request(method,path,**kwargs):
        if path.endswith("resolve"):
            return {"cached":state["busy"],"source":{"source_id":"ready"}}
        state["uploads"]+=1;state["busy"]=True
        error=RemoteQueryFailed("All upload slots are busy")
        error.worker_status=429;error.worker_code="query_capacity_exceeded";raise error
    monkeypatch.setattr(broker,"_request",request)
    assert broker._source(SimpleNamespace(getFileInChunks=lambda:iter([b"data"])),SimpleNamespace(name="data.csv",size=4,mimetype="text/csv"),"scope","ref")=={"source_id":"ready"}
    assert state["uploads"]==1


def test_other_worker_failures_are_not_retried_and_lock_is_released(broker_settings,monkeypatch):
    broker=DataQueryBroker();uploads=[]
    def request(method,path,**kwargs):
        if path.endswith("resolve"):return {"cached":False}
        uploads.append(1);raise RemoteQueryFailed("Unsupported source")
    monkeypatch.setattr(broker,"_request",request)
    for _ in range(2):
        with pytest.raises(RemoteQueryFailed,match="Unsupported source"):
            broker._source(SimpleNamespace(getFileInChunks=lambda:iter([b"data"])),SimpleNamespace(name="data.csv",size=4,mimetype="text/csv"),"scope","ref")
    assert len(uploads)==2
