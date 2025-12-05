# 使用官方Python基础镜像
FROM python:3.10

# 设置工作目录
WORKDIR /code

# 复制项目文件到容器
COPY . /code

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt
#RUN pip install -r code/requirements.txt
#RUN pip install fastapi==0.116.1
#RUN pip install uvicorn==0.35.0
#RUN pip install requests==2.32.4
#RUN pip install pymysql==1.1.1
#RUN pip install bs4==0.0.2

# 暴露端口
EXPOSE 4406

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4406"]


# 本地终端运行
# uvicorn main:app --reload --host 127.0.0.1 --port 4406

# 本地docker上构建
# docker build -t jiancha-xiansuo-analsys-app .
# 本地docker上加载运行容器
# docker run -d --name jiancha-xiansuo-analsys -p 4406:4406 jiancha-xiansuo-analsys-app

# 本地打包
# docker save -o jiancha-xiansuo-analsys-app.tar jiancha-xiansuo-analsys-app
# 云端加载
# docker load -i jiancha-xiansuo-analsys-app.tar

