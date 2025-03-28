#!/bin/sh

# 如果设置了 HEADER_SCRIPTS 环境变量，则注入脚本
if [ ! -z "$HEADER_SCRIPTS" ]; then
    # 使用临时文件来存储脚本内容
    echo "$HEADER_SCRIPTS" > /tmp/header-scripts.txt
    # 使用 sed 在 index.html 的 </head> 标签前注入脚本
    sed -i -e '/<\/head>/i\' -e "$(cat /tmp/header-scripts.txt)" /usr/share/nginx/html/index.html
fi

# 启动 Nginx
exec nginx -g 'daemon off;' 