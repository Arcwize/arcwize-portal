export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const WIX_API_KEY = "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjIyMjUxODY5LWQ2MWMtNGY0MS05YzI2LTBkMjQzYjVkNTIzN1wiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImU4OTFmMzg5LTczNGMtNGM4MS1hNzEzLWZlZDE4MWFkMjQ1ZFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI4ZDczYzY1OC0wYzc2LTQzZjUtYmYzYi02MTdlYjAyMDAwZjdcIn19IiwiaWF0IjoxNzc3MDg3OTQ5fQ.if8Bz_cNjMtLGNVqU1ZADNRuZMXDFq0YxA0sISSAyGuxVFdvo_R638wVseieZTouyk6jmYk03x9zca1hnRDOD9dmSv-L_u__JQh7sLPK7EOWfA0OnZHAO0iWxDEPSnAxKnAaGOpZQXCT3-EakYV-K1xKXUsVZd3OppZIB-umxdQIV5JBP-kxHUkL7c8vqA__gIXWiYLli1AZK27awBJjlbpYErwf7WqBAr8XszLYRbZw-4rm7rqFy1q4kTHMOTEdHjbbmtdna9GeI-wf95QHvTUAkwCPg_VpIeWd0aw96WTucCzGRMc-iJrpB0mhpx4UfB8qZBqcH5pAiqB2qTWUbg";
  const WIX_SITE_ID = "455c12fa-d597-4a3e-ba87-1e6c51e493e8";
  const WIX_MEMBER_ID = "8d73c658-0c76-43f5-bf3b-617eb02000f7";

  try {
    const incoming = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // Inject memberId into the draftPost
    const payload = {
  draftPost: {
    memberId: WIX_MEMBER_ID,
    title: incoming.draftPost.title,
    excerpt: incoming.draftPost.excerpt,
    categoryIds: incoming.draftPost.categoryIds,
    tagIds: incoming.draftPost.tagIds,
    richContent: incoming.draftPost.richContent,
    status: "IN_REVIEW",
  }
};

    const response = await fetch("https://www.wixapis.com/blog/v3/draft-posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": WIX_API_KEY,
        "wix-site-id": WIX_SITE_ID,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      console.error("Wix API error:", response.status, text);
      return res.status(response.status).json({ error: "Wix rejected the request", details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Submit error:", error);
    return res.status(500).json({ error: "Failed to submit to Wix", details: error.message });
  }
}
