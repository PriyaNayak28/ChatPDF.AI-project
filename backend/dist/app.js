"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("./routes/user"));
const premium_1 = __importDefault(require("./routes/premium"));
const chat_1 = __importDefault(require("./routes/chat"));
const embedding_1 = require("./util/embedding");
const pdf_1 = __importDefault(require("./models/pdf"));
const uuid_1 = require("uuid");
const storeEmbeddings_1 = require("./services/storeEmbeddings");
const associate_1 = require("./models/associate");
const auth_1 = require("./middleware/auth");
const database_1 = __importDefault(require("./util/database"));
dotenv_1.default.config();
(0, associate_1.setupAssociations)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.static(path_1.default.join(__dirname, 'views')));
app.use('/user', user_1.default);
app.use('/premium', premium_1.default);
app.use('/groq', chat_1.default);
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({ storage });
function chunkText(text, chunkSize = 1000, overlap = 100) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
        const chunk = text.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
}
app.post('/upload', auth_1.authenticate, upload.single('pdf'), (req, res, next) => {
    ;
    (async () => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const filePath = req.file.path;
            const dataBuffer = fs_1.default.readFileSync(filePath);
            const pdfData = await (0, pdf_parse_1.default)(dataBuffer);
            const extractedText = pdfData.text;
            const chunks = chunkText(extractedText, 1000, 100);
            const embeddings = await Promise.all(chunks.map((chunk) => (0, embedding_1.embedText)(chunk)));
            const pdf = await pdf_1.default.create({
                id: (0, uuid_1.v4)(),
                userId: userId,
                storedFilename: req.file.filename,
                originalFilename: req.file.originalname,
                filePath: req.file.path,
                uploadDate: new Date(),
            });
            await (0, storeEmbeddings_1.storeEmbeddingsToPinecone)(pdf.id, userId.toString(), chunks);
            res.json({
                success: true,
                data: {
                    pdfId: pdf.id,
                    message: 'PDF uploaded and processed successfully',
                },
            });
        }
        catch (error) {
            console.error('Error processing PDF:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res
                .status(500)
                .json({ message: 'Error processing PDF', error: errorMessage });
        }
    })().catch(next);
});
app.get('/pdfs', auth_1.authenticate, (req, res, next) => {
    ;
    (async () => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const pdfs = await pdf_1.default.findAll({
                where: { userId },
                order: [['uploadDate', 'DESC']],
            });
            res.json({
                success: true,
                data: pdfs,
            });
        }
        catch (error) {
            console.error('Error fetching PDFs:', error);
            res.status(500).json({ message: 'Error fetching PDFs' });
        }
    })().catch(next);
});
app.get('/pdf/:filename', auth_1.authenticate, (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path_1.default.join(__dirname, 'uploads', filename);
    if (fs_1.default.existsSync(filePath)) {
        res.sendFile(filePath);
    }
    else {
        res.status(404).send('File not found');
    }
});
const PORT = process.env.PORT || 5000;
database_1.default
    .sync()
    .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Sequelize sync error:', err);
});
