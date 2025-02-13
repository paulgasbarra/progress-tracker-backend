import fetch from "node-fetch";

export default async function fetchCodeFromRepo(
  repoUrl,
  folderPath = "",
  fileTypes = ["jsx", "tsx"]
) {
  try {
    // Extract owner and repo from the URL
    const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

    // GitHub API URL to list contents of a specific folder
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Optionally add an Authorization header if you have a GitHub token
        // Authorization: `token ${process.env.GITHUB_TOKEN}`
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch repository contents: ${response.statusText}`
      );
    }

    const files = await response.json();

    // Filter files by specified types
    const filteredFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop();
      return fileTypes.includes(fileExtension);
    });

    // Fetch the content of each filtered file
    const fileContents = await Promise.all(
      filteredFiles.map(async (file) => {
        if (file.type === "file") {
          const fileResponse = await fetch(file.download_url);
          return fileResponse.text();
        }
        return "";
      })
    );
    console.log("fileContents", fileContents);

    // Combine all file contents into a single string
    return fileContents.join("\n");
  } catch (error) {
    console.error("Error fetching code from repo:", error);
    throw error;
  }
}
