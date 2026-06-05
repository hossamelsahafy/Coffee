// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import nodemailer from "nodemailer";
import { stripeCreatePayment } from "@/app/(payload)/endpoints/payments/stripe";
import { Users } from "@/app/(payload)/_collections/Users";
import { Media } from "@/app/(payload)/_collections/Media";
import { Categories } from "@/app/(payload)/_collections/Categories";
import Products from "@/app/(payload)/_collections/Products";
import { OriginsOfCoffee } from "@/app/(payload)/_collections/OriginsOfCoffee";
import { Blogs } from "@/app/(payload)/_collections/Blogs";
import { Subscripe } from "@/app/(payload)/_collections/Subscriped";
import { Notes } from "@/app/(payload)/_collections/Notes";
import { ShippingZones } from "@/app/(payload)/_collections/ShippingZones";
import { Orders } from "@/app/(payload)/_collections/Order";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER!,
    defaultFromName: "Coffee Store",

    transport: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
  endpoints: [stripeCreatePayment],

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    OriginsOfCoffee,
    Blogs,
    Subscripe,
    Notes,
    ShippingZones,
    Orders,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
});
