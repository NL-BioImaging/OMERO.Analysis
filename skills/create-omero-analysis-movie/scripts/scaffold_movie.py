import argparse
import json
from pathlib import Path
from uuid import UUID

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('output', type=Path)
    identity = parser.add_mutually_exclusive_group(required=True)
    identity.add_argument('--store-uuid')
    identity.add_argument('--current-image', action='store_true')
    parser.add_argument('--field', default='.')
    parser.add_argument('--roi', type=int, nargs=4, required=True)
    parser.add_argument('--frames', type=int, nargs=2, required=True)
    parser.add_argument('--fps', type=float, default=5)
    parser.add_argument('--z', type=int, default=0)
    parser.add_argument('--channels', type=int, nargs='+', default=[1])
    args = parser.parse_args()
    if args.store_uuid:
        UUID(args.store_uuid)
    x0, y0, x1, y1 = args.roi
    start, end = args.frames
    if min(args.roi) < 0 or not 0 < x1-x0 <= 2048 or not 0 < y1-y0 <= 2048 or not 0 <= start <= end < start+600 or not 0 < args.fps <= 60:
        parser.error('Invalid crop, frame range, or FPS')
    recipe = {'version': 2, 'storeUuid': args.store_uuid,
              'sequence': {'version': 1, 'start': start, 'end': end, 'fps': args.fps},
              'panels': [{'field': args.field, 'roi': args.roi, 'sourceChannels': args.channels,
                          't': end, 'z': args.z, 'title': 'Temporal data', 'overlays': []}]}
    if args.current_image:
        recipe.pop('storeUuid')
        recipe['source'] = {'kind': 'current-image'}
    args.output.write_text(json.dumps(recipe, indent=2) + '\n', encoding='utf-8')
    print('Created portable movie recipe; playback defaults to 5 FPS')

if __name__ == '__main__':
    main()
