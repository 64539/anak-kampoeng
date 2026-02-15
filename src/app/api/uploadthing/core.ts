import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSession } from "@/lib/auth/session";

const f = createUploadthing();

export const ourFileRouter = {
  galleryUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    video: { maxFileSize: "32MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
  insightImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
