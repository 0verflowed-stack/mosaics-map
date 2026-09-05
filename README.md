# To add new mosaic

1. Take a screenshot of the mosaic;
2. Right click on website on location you want to add mosaic and copy latitude and longitude values;
3. Put screenshot in `public/screenshots` folder;
4. Add in `src/components/MapView/mapData.json` to `locations`. Make sure `id` and image name is unique. Example:
```json
{
            "id": 4149971, // increment from last item
            "map_id": 726,
            "region_id": 3082,
            "category_id": 11899,
            "title": "Mosaic 2",
            "description": null,
            "latitude": 0.51909484303286, // update coordinates
            "longitude": -0.66517166607335, // update coordinates
            "features": null,
            "ign_page_id": null,
            "tags": [],
            "media": [{
                "attribution": "",
                "file_name":"2.jpg", // update file name
                "id": 61685,
                "meta": null,
                "mime_type": "image/jpeg",
                "order": 10,
                "title": "",
                "type": "image",
                "url": "/screenshots/2.jpg" // update file name
            }],
            "category": {
                "id": 11899,
                "group_id": 2030,
                "title": "Mosaic",
                "icon": "mosaic",
                "info": null,
                "template": null,
                "order": 1,
                "has_heatmap": false,
                "features_enabled": false,
                "display_type": "marker",
                "ign_enabled": true,
                "ign_visible": true,
                "visible": false,
                "description": null,
                "premium": false
            }
        },
```
;

5. Open PR into `main` branch.