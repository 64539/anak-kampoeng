import { strict as assert } from "assert";
import { extractYouTubeVideoId, buildYouTubeThumbnailUrl, isSupportedEmbedUrl, isYouTubeUrl } from "../src/lib/media.js";

function runTests() {
  assert.equal(isYouTubeUrl("https://www.youtube.com/watch?v=abc123"), true);
  assert.equal(isYouTubeUrl("https://youtu.be/abc123"), true);
  assert.equal(isYouTubeUrl("https://example.com/video"), false);

  assert.equal(isSupportedEmbedUrl("https://www.youtube.com/watch?v=abc123"), true);
  assert.equal(isSupportedEmbedUrl("https://www.tiktok.com/@user/video/123"), true);
  assert.equal(isSupportedEmbedUrl("https://example.com/video"), false);

  assert.equal(extractYouTubeVideoId("https://www.youtube.com/watch?v=abc123"), "abc123");
  assert.equal(extractYouTubeVideoId("https://youtu.be/xyz789"), "xyz789");
  assert.equal(extractYouTubeVideoId("https://www.youtube.com/embed/xyz789"), "xyz789");
  assert.equal(extractYouTubeVideoId("https://www.youtube.com/shorts/shortid"), "shortid");
  assert.equal(extractYouTubeVideoId("https://example.com/watch?v=abc123"), null);

  assert.equal(
    buildYouTubeThumbnailUrl("abc123"),
    "https://img.youtube.com/vi/abc123/maxresdefault.jpg"
  );

  console.log("media-utils tests passed");
}

runTests();

