// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import nodemailer from "nodemailer";
import { Users } from "@/app/(payload)/_collections/Users";
import { Media } from "@/app/(payload)/_collections/Media";
import { Categories } from "@/app/(payload)/_collections/Categories";
import Products from "@/app/(payload)/_collections/Products";
import { Countries } from "@/app/(payload)/_collections/Countries";
import { Reviews } from "@/app/(payload)/_collections/Reviews";
import { Subscripe } from "@/app/(payload)/_collections/Subscriped";
import { Notes } from "@/app/(payload)/_collections/Notes";
import { ShippingZones } from "@/app/(payload)/_collections/ShippingZones";
import { Orders } from "@/app/(payload)/_collections/Order";
import { AboutPage } from "@/app/(payload)/_globals/AboutPage";
import { ContactUsPage } from "@/app/(payload)/_globals/ContactUsPage";
import { Favorites } from "@/app/(payload)/_collections/Favorites";
import { ProductViews } from "@/app/(payload)/_collections/ProductsViews";
import { HomePage } from "@/app/(payload)/_globals/HomePage";
import { Footer } from "@/app/(payload)/_globals/Footer";
import { FAQs } from "@/app/(payload)/_globals/FAQs";
import { NotesPage } from "@/app/(payload)/_globals/NotesPage";
import { Collections } from "@/app/(payload)/_globals/Collections";
import { Policy } from "@/app/(payload)/_globals/Policy";
import { shippingDelivery } from "@/app/(payload)/_globals/ShippingDelivery";
import { TermsAndConditions } from "@/app/(payload)/_globals/TermsAndConditions";

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

  admin: {
    components: {
      graphics: {
        Logo: "@/components/admin/CustomLogo",
      },
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Countries,
    Reviews,
    Subscripe,
    Notes,
    ShippingZones,
    Orders,
    Favorites,
    ProductViews,
  ],
  globals: [
    HomePage,
    Collections,
    AboutPage,
    FAQs,
    ContactUsPage,
    Footer,
    NotesPage,
    Policy,
    shippingDelivery,
    TermsAndConditions,
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
