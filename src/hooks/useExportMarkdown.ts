import { Post } from "../Stores/postsSlice";

const useExportMarkdown = () => {
    const exportPost = (post: Post) => {
        const frontmatter = [
            "---",
            `title: "${post.title}"`,
            `date: ${new Date(post.createdAt).toISOString().slice(0, 10)}`,
            post.tags.length > 0 ? `tags: [${post.tags.map((t) => `"${t}"`).join(", ")}]` : null,
            post.excerpt ? `excerpt: "${post.excerpt}"` : null,
            "---",
            "",
        ]
            .filter((l) => l !== null)
            .join("\n");

        const blob = new Blob([frontmatter + post.content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${post.title.replace(/[^\w가-힣]/g, "-").replace(/-+/g, "-")}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return { exportPost };
};

export default useExportMarkdown;
