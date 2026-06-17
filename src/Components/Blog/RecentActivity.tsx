import styled from "styled-components";
import { Link } from "react-router-dom";
import { Post } from "../../Stores/postsSlice";
import { colors } from "../../Styles/theme.styles";

interface Props { posts: Post[]; }

const Card = styled.div`
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${colors.textMuted};
    letter-spacing: 0.04em;
    margin-bottom: 1rem;
`;

const Timeline = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
`;

const Item = styled.li`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid ${colors.border};

    &:last-child { border-bottom: none; }
`;

const Dot = styled.div<{ $color: string }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    flex-shrink: 0;
    margin-top: 0.35rem;
`;

const ItemBody = styled.div`
    flex: 1;
    min-width: 0;
`;

const ItemTitle = styled(Link)`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.text};
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.15rem;

    &:hover { color: ${colors.accent}; }
`;

const ItemMeta = styled.div`
    font-size: 0.72rem;
    color: ${colors.textLight};
    display: flex;
    align-items: center;
    gap: 0.4rem;
`;

const ItemBadge = styled.span<{ $color: string }>`
    font-size: 0.68rem;
    font-weight: 600;
    color: ${({ $color }) => $color};
    background: ${({ $color }) => $color}18;
    padding: 0.1em 0.45em;
    border-radius: 4px;
`;

const Tag = styled.span`
    color: ${colors.accent};
    font-size: 0.68rem;
`;

const formatAgo = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    const days = Math.floor(diff / 1440);
    if (days < 7) return `${days}일 전`;
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
};

const RecentActivity = ({ posts }: Props) => {
    if (posts.length === 0) return null;

    type EventType = "created" | "updated";
    const events = [...posts]
        .flatMap((p) => {
            const items: { post: Post; type: EventType; time: string }[] = [
                { post: p, type: "created", time: p.createdAt },
            ];
            if (p.updatedAt !== p.createdAt) {
                items.push({ post: p, type: "updated", time: p.updatedAt });
            }
            return items;
        })
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 7);

    return (
        <Card>
            <CardTitle>🕐 최근 활동</CardTitle>
            <Timeline>
                {events.map((ev, i) => {
                    const isNew = ev.type === "created";
                    const dotColor = isNew ? colors.success : colors.accent;
                    return (
                        <Item key={`${ev.post.id}-${ev.type}-${i}`}>
                            <Dot $color={dotColor} />
                            <ItemBody>
                                <ItemTitle to={`/post/${ev.post.id}`}>
                                    {ev.post.title}
                                </ItemTitle>
                                <ItemMeta>
                                    <ItemBadge $color={dotColor}>
                                        {isNew ? "작성" : "수정"}
                                    </ItemBadge>
                                    <span>{formatAgo(ev.time)}</span>
                                    {ev.post.tags.slice(0, 2).map((t) => (
                                        <Tag key={t}>#{t}</Tag>
                                    ))}
                                </ItemMeta>
                            </ItemBody>
                        </Item>
                    );
                })}
            </Timeline>
        </Card>
    );
};

export default RecentActivity;
