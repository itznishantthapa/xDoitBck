import { saveAs } from "file-saver";
import JSZip from "jszip";

function getFileNameFromUrl(url: string, index: number) {
  const rawName = url.split("/").pop();
  if (!rawName) return `file-${index + 1}`;

  return decodeURIComponent(rawName);
}

export function toZipFileName(title: string) {
  const pascalCase = title
    .trim()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  return `${pascalCase || "Assignment"}.zip`;
}

export function toCompletedFileName(title: string, fileUrl: string) {
  const camelCase = title
    .trim()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");

  const fileName = fileUrl.split("/").pop() ?? "";
  const extensionMatch = fileName.match(/\.(\w+)(?:\?|$)/);
  const extension = extensionMatch?.[1] ?? "file";

  return `${camelCase || "assignment"}Completed.${extension}`;
}

export async function downloadSingleFile(url: string, fileName: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${url}`);
  }

  const blob = await response.blob();
  saveAs(blob, fileName);
}

export async function downloadFilesAsZip(
  urls: string[],
  zipFileName: string
) {
  if (urls.length === 0) return;

  const zip = new JSZip();

  await Promise.all(
    urls.map(async (url, index) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${url}`);
      }

      const blob = await response.blob();
      zip.file(getFileNameFromUrl(url, index), blob);
    })
  );

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, zipFileName);
}
