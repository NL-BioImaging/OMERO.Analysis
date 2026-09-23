from scripts.build_data_query_benchmark_notebook import CONTRACT, build_notebook

def test_benchmark_notebook_is_portable_and_covers_full_matrix():
    document = build_notebook()
    configuration = document["cells"][0]
    helpers_source = document["cells"][3]["source"]
    aggregate_source = document["cells"][4]["source"]
    smoke_cells = document["cells"][5:8]
    full_cells = document["cells"][8:17]
    report_source = document["cells"][17]["source"]

    assert configuration["metadata"]["tags"] == ["omero-analysis-config"]
    assert CONTRACT["schema"] == "nl.bioimaging.omero-analysis-notebook.v1"
    assert [item["id"] for item in CONTRACT["inputs"]] == ["duckdb", "sqlite", "csv"]
    assert CONTRACT["parameters"][1]["default"] == 10_000_000
    assert CONTRACT["parameters"][1]["maximum"] == 10_000_000
    assert 'for repetition in range(4)' in helpers_source
    assert 'blocked_full_formats.add(format_name)' in helpers_source
    assert 'await run_group("aggregate", size, FORMATS)' in aggregate_source
    assert len(smoke_cells) == 3
    assert all("SIZES[0] not in" in cell["source"] for cell in smoke_cells)
    assert len(full_cells) == 9
    assert [cell["id"] for cell in full_cells] == [
        f"benchmark-full-{size}-{format_name}"
        for size in (1_000_000, 4_000_000, 10_000_000)
        for format_name in ("duckdb", "sqlite", "csv")
    ]
    assert 'dataquery-benchmark-results.csv' in document["cells"][2]["source"]
    assert 'for temperature in ("cold", "warm")' in report_source
    assert 'dataquery-benchmark-{query_type}-{temperature}.png' in report_source
