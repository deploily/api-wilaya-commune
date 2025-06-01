const turf = require('@turf/turf');
const fs = require('fs');

/**
 * @swagger
 * /api/v1/getWilaya:
 *   get:
 *     summary: Get wilaya by coordinates
 *     description: Retrieve wilaya details based on latitude and longitude.
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude coordinate.
 *       - in: query
 *         name: long
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude coordinate.
 *     responses:
 *       200:
 *         description: Successfully found the wilaya.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     wilaya:
 *                       type: object
 *                       additionalProperties: true
 *       404:
 *         description: Wilaya not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Fail"
 *                 message:
 *                   type: string
 *                   example: "Not found"
 *       400:
 *         description: Bad request (e.g., invalid parameters or file read error).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Fail"
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */

exports.getWilaya = (req, res) => {

    try {

        const wilayasGeoJSON = fs.readFileSync('./data/wilayas_58.geojson');
        const wilayasFeatures = JSON.parse(wilayasGeoJSON).features;

        const lat = Number(req.query.lat)
        const long = Number(req.query.long)
        const point = turf.point([long, lat], {});

        for (let i = 0; i < wilayasFeatures.length; i++) {
            const isInside = turf.inside(point, wilayasFeatures[i]);
            if (isInside) {
                res.status(200).json({
                    status: 'Success',
                    data: {
                        "wilaya": wilayasFeatures[i].properties
                    },
                });
            }
        }
        res.status(404).json({
            status: 'Fail',
            message: "Not found"
        });

    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error.message
        });
    }
}