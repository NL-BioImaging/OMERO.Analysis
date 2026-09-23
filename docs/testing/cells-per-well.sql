SELECT i.run_id, COALESCE(i.plate_row, 'unknown') AS plate_row,
 COALESCE(i.plate_column, 'unknown') AS plate_column,
 l.label_set_index, o.timepoint, COUNT(*) AS cell_count,
 COUNT(DISTINCT i.image_id) AS images_measured
FROM objects o JOIN images i ON i.image_id=o.image_id
JOIN label_sets l ON l.label_set_id=o.label_set_id
WHERE l.object_type='cells' AND NOT o.is_point
GROUP BY i.run_id, i.plate_row, i.plate_column, l.label_set_index, o.timepoint
ORDER BY i.run_id, i.plate_row, i.plate_column, l.label_set_index, o.timepoint
