import { PrismaClient } from "@prisma/client";
const express = require("express");
const path = require("path");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const Line = require('@line/bot-sdk');

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
    keyFilename: path.join(__dirname, process.env.GOOGLE_CREDENTIAL),
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

const client = new Line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
});

router.get(`/announcements`, async (req, res) => {
    var listCount = parseInt(process.env.LIST_COUNT);
    var start = (req.query.page - 1) * listCount;
    const response = {};
    const result = await prisma.announcement.findMany({
        skip: start,
        take: listCount,
        where: {
            deletedAt: null
        },
        orderBy: {
            createdAt: "desc"
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
        totalPages = parseInt(announcementCount / listCount);
    } else {
        totalPages = parseInt(announcementCount / listCount) + 1;
    }
    response.totalPages = totalPages;
    res.json(response);
})

router.post(`/announce`, async (req, res) => {
    var title = req.body.title;
    var content = req.body.content;
    var lineIdArry = req.body.lineIdArry;
    var checkboxNotify = req.body.checkboxNotify;
    var response = {};
    var status = 200;
    const result = await prisma.announcement.create({
        data: {
            title: title,
            content: content,
            updatedAt: new Date()
        }
    })

    if (checkboxNotify) {
        if (lineIdArry.length == 0) {
            status = 404;
            response.message = "沒有可發送的客戶！";
            res.status(status).json(response);

        } else {
            client.multicast(lineIdArry, {
                "type": 'flex',
                "altText": title,
                "contents": {
                    "type": "bubble",
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": title,
                                "weight": "bold",
                                "size": "xl",
                                "align": "center"
                            }
                        ]
                    },
                    "footer": {
                        "type": "box",
                        "layout": "vertical",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "button",
                                "style": "primary",
                                "height": "sm",
                                "action": {
                                    "type": "uri",
                                    "label": "檢視公告",
                                    "uri": process.env.ANNOUNCEMENT_URL + result.id
                                }
                            }
                        ],
                        "flex": 0
                    }
                }
            })
                .then(() => {
                    response.message = "新增公告完成，共發送了" + lineIdArry.length + "則通知！";
                    res.status(status).json(response);
                })
                .catch((err) => {
                    status = 404;
                    response.message = "系統出現問題，重整後再試。"
                    res.status(status).json(response);
                });
        };
    } else {
        response.message = "新增公告完成！";
        res.status(status).json(response);
    }
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
