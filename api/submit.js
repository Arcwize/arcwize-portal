export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const WIX_API_KEY = "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjIyMjUxODY5LWQ2MWMtNGY0MS05YzI2LTBkMjQzYjVkNTIzN1wiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImU4OTFmMzg5LTczNGMtNGM4MS1hNzEzLWZlZDE4MWFkMjQ1ZFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI4ZDczYzY1OC0wYzc2LTQzZjUtYmYzYi02MTdlYjAyMDAwZjdcIn19IiwiaWF0IjoxNzc3MDg3OTQ5fQ.if8Bz_cNjMtLGNVqU1ZADNRuZMXDFq0YxA0sISSAyGuxVFdvo_R638wVseieZTouyk6jmYk03x9zca1hnRDOD9dmSv-L_u__JQh7sLPK7EOWfA0OnZHAO0iWxDEPSnAxKnAaGOpZQXCT3-EakYV-K1xKXUsVZd3OppZIB-umxdQIV5JBP-kxHUkL7c8vqA__gIXWiYLli1AZK27awBJjlbpYErwf7WqBAr8XszLYRbZw-4rm7rqFy1q4kTHMOTEdHjbbmtdna9GeI-wf95QHvTUAkwCPg_VpIeWd0aw96WTucCzGRMc-iJrpB0mhpx4UfB8qZBqcH5pAiqB2qTWUbg";
  const WIX_SITE_ID = "455c12fa-d597-4a3e-ba87-1e6c51e493e8";
  const WIX_MEMBER_ID = "8d73c658-0c76-43f5-bf3b-617eb02000f7";

  const headers = {
    "Content-Type": "application/json",
    "Authorization": WIX_API_KEY,
    "wix-site-id": WIX_SITE_ID,
  };

  const importImageToWix = async (imageUrl) => {
    try {
      const importRes = await fetch("https://www.wixapis.com/media/v1/files/import", {
        method: "POST",
        headers,
        body: JSON.stringify({
  url: imageUrl,
  mimeType: "image/jpeg",
  displayName: "article-image.jpg",
  parentFolderId: "media-root",
}),
      });
      const importData = await importRes.json();
      const fileId = importData?.file?.id;
      if (!fileId) return null;

      // Poll until ready (max 10 seconds)
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const checkRes = await fetch(`https://www.wixapis.com/site-media/v1/files/${fileId}`, { headers });
        const checkData = await checkRes.json();
        if (checkData?.file?.operationStatus === "READY") {
          return checkData.file.url;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  try {
    const incoming = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { draftPost, coverImageUrl, inlineImageUrls } = incoming;

    // Import cover image into Wix if provided
    let wixCoverUrl = null;
    if (coverImageUrl) {
      wixCoverUrl = await importImageToWix(coverImageUrl);
    }

    // Import inline images into Wix
    let wixInlineUrls = {};
    if (inlineImageUrls && inlineImageUrls.length > 0) {
      for (const url of inlineImageUrls) {
        const wixUrl = await importImageToWix(url);
        if (wixUrl) wixInlineUrls[url] = wixUrl;
      }
    }

    // Build rich content nodes — replace inline image src with Wix URLs
    const nodes = draftPost.richContent?.nodes?.map(node => {
      if (node.type === "IMAGE" && node.imageData?.image?.src?.url) {
        const original = node.imageData.image.src.url;
        return {
          ...node,
          imageData: {
            ...node.imageData,
            image: {
              src: { url: wixInlineUrls[original] || original }
            }
          }
        };
      }
      return node;
    }) || [];

    const payload = {
      draftPost: {
        memberId: WIX_MEMBER_ID,
        title: draftPost.title,
        excerpt: draftPost.excerpt,
        categoryIds: draftPost.categoryIds,
        tagIds: draftPost.tagIds,
        richContent: { nodes },
      }
    };

    // Attach cover image
    if (wixCoverUrl) {
      payload.draftPost.coverMedia = {
        image: { src: { url: wixCoverUrl } }
      };
    }

    const createRes = await fetch("https://www.wixapis.com/blog/v3/draft-posts", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      return res.status(createRes.status).json({ error: "Failed to create post", details: createData });
    }

    return res.status(200).json({ ...createData, wixInlineUrls });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
