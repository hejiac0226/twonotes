export function formatDate(date: Date): string {
    // 如果传入的是字符串日期，转换为Date对象
    const d = new Date(date);

    // 获取当前日期
    const now = new Date();

    // 如果是今天的日期，只显示时间
    if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 如果是今年的日期，显示月份和日期
    if (d.getFullYear() === now.getFullYear()) {
        return d.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric'
        });
    }

    // 其他情况显示完整日期
    return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
} 