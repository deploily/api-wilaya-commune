const turf = require('@turf/turf');
const fs = require('fs');

/**
 * @swagger
 * /api/v1/getCommune:
 *   get:
 *     summary: Get commune by coordinates
 *     description: Retrieve commune details based on latitude and longitude.
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
 *         description: Successfully found the commune.
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
 *                     commune:
 *                       type: object
 *                       additionalProperties: true
 *       404:
 *         description: Commune not found.
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

exports.getCommune = (req, res) => {

    try {
        const communesGeoJSON = fs.readFileSync('./data/communes_58.geojson');
        const communesFeatures = JSON.parse(communesGeoJSON).features;

        const lat = Number(req.query.lat)
        const long = Number(req.query.long)
        const point = turf.point([long, lat], {});

        for (let i = 0; i < communesFeatures.length; i++) {
            const isInside = turf.inside(point, communesFeatures[i]);
            if (isInside) {
                res.status(200).json({
                    status: 'Success',
                    data: {
                        "commune": communesFeatures[i].properties
                    },
                });
                break;
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