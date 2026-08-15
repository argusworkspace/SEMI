.PHONY: dev dev-web dev-api install install-api migrate migration shell-api

# Start both services
dev:
	@echo "Starting frontend and backend..."
	@make -j2 dev-web dev-api

dev-web:
	cd apps/web && npm run dev

dev-api:
	cd apps/api && .venv/bin/uvicorn src.main:app --reload --port 8000

# Install dependencies
install:
	npm install
	cd apps/api && python -m venv .venv && .venv/bin/pip install -e ".[dev]"

install-api:
	cd apps/api && python -m venv .venv && .venv/bin/pip install -e ".[dev]"

# Database
migrate:
	cd apps/api && .venv/bin/alembic upgrade head

migration:
	cd apps/api && .venv/bin/alembic revision --autogenerate -m "$(name)"

downgrade:
	cd apps/api && .venv/bin/alembic downgrade -1

# Utility
shell-api:
	cd apps/api && .venv/bin/python
