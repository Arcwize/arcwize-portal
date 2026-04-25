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

  const importImage = async (url) => {
    try {
      const r = await fetch("https://www.wixapis.com/site-media/v1/files/import", {
        method: "POST",
        headers,
        body: JSON.stringify({ url, mimeType: "image/jpeg", displayName: "article-image.jpg", parentFolderId: "media-root" }),
      });
      const d = await r.json();
      if (!d?.file?.id) return null;
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const check = await fetch(`https://www.wixapis.com/site-media/v1/files/${d.file.id}`, { headers });
        const cd = await check.json();
        if (cd?.file?.operationStatus === "READY") return cd.file.url;
      }
      return null;
    } catch { return null; }
  };

  try {
    const incoming = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { draftPost, inlineImageUrls } = incoming;

    // Import all inline images into Wix and map original -> wix url
    const wixUrls = {};
    if (inlineImageUrls?.length) {
      for (const url of inlineImageUrls) {
        const wixUrl = await importImage(url);
        if (wixUrl) wixUrls[url] = wixUrl;
      }
    }

    // Build nodes — paragraphs first, then images
    const textNodes = draftPost.richContent?.nodes || [];
    const imageNodes = Object.values(wixUrls).map(wixUrl => ({
      type: "IMAGE",
      imageData: {
        image: { src: { url: wixUrl } },
        containerData: { width: { size: "CONTENT" }, alignment: "CENTER" }
      }
    }));

    const payload = {
      draftPost: {
        memberId: WIX_MEMBER_ID,
        title: draftPost.title,
        excerpt: draftPost.excerpt,
        categoryIds: draftPost.categoryIds,
        tagIds: draftPost.tagIds,
        richContent: { nodes: [...textNodes, ...imageNodes] },
      }
    };

    const r = await fetch("https://www.wixapis.com/blog/v3/draft-posts", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: "Wix error", details: data });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
