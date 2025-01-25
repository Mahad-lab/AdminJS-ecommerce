import AdminJS, { ComponentLoader } from 'adminjs'
import express from 'express'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/mongoose'
import mongoose from 'mongoose'
import { getLeafletDist } from '@adminjs/leaflet'
import { createCustomerResource } from './resources/customer.resource'
import { createShipmentResource } from './resources/shipment.resource'
import path from 'path'
import dotenv from 'dotenv'
const PORT = 3001

dotenv.config()

// We'll need to register the mongoose Adapter
AdminJS.registerAdapter({
  Database,
  Resource
})

export const componentLoader = new ComponentLoader()

export const Components = {
  // PDFGenerator: componentLoader.add('GeneratePDF', './custom_components/pdfgenerator.component'),
  InvoiceForm: componentLoader.add('InvoiceForm', './custom_components/invoice.form.component'),
}

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async () => {
  return { email: DEFAULT_ADMIN.email }
}

// Create and configure Express app
const app = express()

app.use(express.static(getLeafletDist()))
app.use(express.static(path.join(__dirname, 'pdfs/')))
app.use(express.static(path.join(__dirname, 'public/')))

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Successfully connected to the DB')
  } catch (error) {
    console.log(error)
  }
}

// Initialize AdminJS
const initAdminJS = async () => {
  const admin = new AdminJS({
    rootPath: '/admin',
    branding: {
      companyName: 'Company',
      logo: 'URL_TO_YOUR_LOGO', // Replace with your logo URL
      withMadeWithLove: false
    },
    resources: [
      createShipmentResource(),
      // createCustomerResource(),
    ],
    componentLoader,
    assets: {
      styles: ['/custom.css']
    }
  })


  // TODO: authentication router
  // const secret = 'very_secret_secret'
  // const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  //   admin,
  //   {
  //     authenticate,
  //     cookiePassword: 'very_secret_secret',
  //   },
  //   null,
  //   {
  //     resave: true,
  //     saveUninitialized: true,
  //     secret,
  //   },
  // )
  // app.use(admin.options.rootPath, adminRouter)

  // TODO: no authentication router
  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)
  return admin
}

// Start server function
const start = async () => {
  await connectDB()
  const admin = await initAdminJS()
  
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })
  }
}

// Export the configured app for Vercel
export default app

// Start the server if running directly
if (require.main === module) {
  start()
}
