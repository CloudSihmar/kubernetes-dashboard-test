FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    openssh-client \
    git \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip -o terraform.zip \
    && unzip terraform.zip \
    && mv terraform /usr/local/bin/ \
    && rm terraform.zip

RUN pip install --no-cache-dir ansible ansible-runner

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

RUN mkdir -p /app/media /app/static /app/staticfiles /app/ansible_data /app/terraform_data

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "devops_platform.asgi:application"]
