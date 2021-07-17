import { PrismaClient } from "@prisma/client";
const express = require("express");
const path = require("path");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

var router = express.Router();
var prisma = new PrismaClient();

const multer = Multer({
    file: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});
router.use(multer.array('file'));

const storage = new Storage({
    keyFilename: path.join(__dirname, "../../google-cloud-key.json"),
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);


router.get(`/announcements`, async (req, res) => {
    var listCount = 9;
    var start = (req.query.page - 1) * listCount;
    const response = {};
    const result = await prisma.announcement.findMany({
        skip: start,
        take: listCount,
        where: {
            deletedAt: null
        }
    });

    var totalPages = 0;
    const announcementCount = await prisma.announcement.count({
        where: {
            deletedAt: null
        }
    });
    response.list = result;
    response.page = req.query.page;

    if (announcementCount % 9 == 0) {
        totalPages = parseInt(announcementCount / 9);
    } else {
        totalPages = parseInt(announcementCount / 9) + 1;
    }
    response.totalPages = totalPages;
    res.json(response);
})

router.post(`/announce`, async (req, res) => {
    const result = await prisma.announcement.create({
        data: {
            title: req.body.data.title,
            content: req.body.data.content,
            updatedAt: new Date()
        }
    })
    res.status(200).json(result);
})

router.post(`/announce/:id`, async (req, res) => {
    const { id } = req.params;
    const result = await prisma.announcement.update({
        where: {
            id: Number(id),
        },
        data: {
            title: req.body.data.title,
            content: req.body.data.content,
            updatedAt: new Date()
        }
    });
    res.json(result);
})

router.post('/upload', multer.single('file'), (req, res, next) => {
    if (!req.files) {
        res.status(400).send('No file uploaded.');
        return;
    }
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file("announcement/" + req.files[0].originalname);
    const blobStream = blob.createWriteStream();
    blobStream.on('error', err => {
        next(err);
    });

    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        res.status(200).send(publicUrl);
    });

    blobStream.end(req.files[0].buffer);
    console.log(blobStream);
});


router.post(`/announce/delete/:id`, async (req, res) => {
    const { id } = req.params;
    const result = await prisma.announcement.update({
        where: {
            id: Number(id),
        },
        data: {
            updatedAt: new Date(),
            deletedAt: new Date()
        }
    });
    res.json(result);
})

module.exports = router;
