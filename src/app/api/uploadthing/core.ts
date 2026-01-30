import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
 
const f = createUploadthing();
 
// FileRouter for app - defines upload endpoints and their allowed file types
export const ourFileRouter = {
  // Endpoint for vendor store logo uploads
  storeLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Authenticate user
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.email) {
        throw new Error("Unauthorized");
      }
      
      // Look up user ID from email
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Return user info to be available in onUploadComplete
      return { userId: user.id, userEmail: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on server after upload
      console.log("Logo upload complete for user:", metadata.userEmail);
      console.log("File URL:", file.url);
      
      // Return data to client
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
  // Endpoint for vendor store banner uploads
  storeBanner: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.email) {
        throw new Error("Unauthorized");
      }
      
      // Look up user ID from email
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      
      if (!user) {
        throw new Error("User not found");
      }
      
      return { userId: user.id, userEmail: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Banner upload complete for user:", metadata.userEmail);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
  // Endpoint for product image uploads
  productImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.email) {
        throw new Error("Unauthorized");
      }
      
      // Look up user ID from email
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      
      if (!user) {
        throw new Error("User not found");
      }
      
      return { userId: user.id, userEmail: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Product image upload complete for user:", metadata.userEmail);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
