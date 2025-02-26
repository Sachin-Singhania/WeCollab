import express from 'express';
import expressProxy from 'express-http-proxy';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const proxyMiddleware = (target:any) => (req : any, res: any, next: any) => {
    const isMultipart = req.headers['content-type']?.includes('multipart/form-data');

    expressProxy(target, {
        parseReqBody: !isMultipart, 
        preserveHostHdr: true,

        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = proxyReqOpts.headers || {};

            if (srcReq.headers['cookie']) {
                proxyReqOpts.headers['cookie'] = srcReq.headers['cookie'];
            }

            if (srcReq.headers['content-type']) {
                proxyReqOpts.headers['content-type'] = srcReq.headers['content-type'];
            }

            return proxyReqOpts;
        },

        proxyReqBodyDecorator: (bodyContent, srcReq) => {
            if (isMultipart) {
                return bodyContent; 
            }
            return JSON.stringify(bodyContent); 
        },
    })(req, res, next);
};

app.use('/user', proxyMiddleware('http://localhost:3001'));
app.use('/video', proxyMiddleware('http://localhost:8080'));
app.use('/dashboard', proxyMiddleware('http://localhost:8080'));

app.listen(3010, () => {
    console.log('Gateway server listening on port 3010');
});
