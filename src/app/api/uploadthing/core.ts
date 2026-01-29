import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
 
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
      
      // Return user info to be available in onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on server after upload
      console.log("Logo upload complete for userId:", metadata.userId);
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
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Banner upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
