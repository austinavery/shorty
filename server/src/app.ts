import express, { Request } from "express";
import cryptoRandomString from "crypto-random-string";
import bodyParser from "body-parser";
import { URLMetaOutput, URLRequest, URLMeta } from "./models";
import mongoose from "mongoose";

const router = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/api", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});

interface ShortyError {
  error: string;
}

router.get;

router.post(
  "/api/shorty",
  async (
    req: Request<unknown, URLMetaOutput | ShortyError, Partial<URLRequest>>,
    res
  ) => {
    const fullURL = req.body.fullURL;

    if (!fullURL) {
      return res.status(400).send({ error: "FullURL is required!" });
    }

    // TODO: add URL validation

    const urlMeta = new URLMeta({
      fullURL,
      shortURL: cryptoRandomString({ length: 5 }),
    });

    const documents = await URLMeta.find({});

    console.log(documents);

    try {
      const urlMetaOutput = await urlMeta.save();

      return res.send(urlMetaOutput);
    } catch (e) {
      console.log(e.message);
      return res.status(500).send({ error: "Failed to save URL." });
    }
  }
);

router.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
