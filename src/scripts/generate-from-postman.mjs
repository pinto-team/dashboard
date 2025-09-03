#!/usr/bin/env node
/**
 * generate-from-postman.mjs
 * -------------------------
 * Simple generator to scaffold a feature (React) from postman-collection.json
 * Step 1: test with "categories" entity
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input / output
const COLLECTION_FILE = path.resolve(__dirname, "postman-collection.json");
const TEMPLATES_DIR = path.resolve(__dirname, "templates");
const API_ROUTES_FILE = path.resolve(
    __dirname,
    "../shared/constants/apiRoutes.ts"
);
const ROUTES_FILE = path.resolve(
    __dirname,
    "../app/routes/routes.ts"
);
const FEATURES_DIR = path.resolve(__dirname, `../features/`);

// ---------- Helpers ----------
function loadCollection() {
    const raw = fs.readFileSync(COLLECTION_FILE, "utf-8");
    return JSON.parse(raw);
}

function renderTemplate(templateFile, context) {
    const tplPath = path.join(TEMPLATES_DIR, templateFile);
    const tpl = fs.readFileSync(tplPath, "utf-8");
    const compile = handlebars.compile(tpl);
    return compile(context);
}

function writeFile(targetPath, content) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, "utf-8");
    console.log("✅ created:", targetPath);
}

function inferTsType(value) {
    if (typeof value === "string") {
        if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return "string // ISO date";
        if (/^[0-9a-fA-F-]{36}$/.test(value)) return "string // uuid";
        return "string";
    }
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";
    if (Array.isArray(value)) return "any[]";
    if (typeof value === "object" && value !== null) return "Record<string, any>";
    return "any";
}

function extractModelFromResponse(entityItem) {
    // Get → Successful Response
    const getDetail = entityItem.item
        .flatMap(i => i.item || [])
        .find(req => req.name.toLowerCase().includes("get"));

    const body = getDetail?.response?.[0]?.body;
    if (!body) return [];

    let sample;
    try {
        sample = JSON.parse(body);
    } catch {
        return [];
    }

    return Object.entries(sample).map(([key, val]) => ({
        name: key,
        type: inferTsType(val),
    }));
}

function extractCreateRequestFields(entityItem) {
    const createReq = entityItem.item.find(i =>
        i.name.toLowerCase().includes("create")
    );

    const body = createReq?.request?.body?.raw;
    if (!body) return [];

    let sample;
    try {
        sample = JSON.parse(body);
    } catch {
        return [];
    }

    return Object.entries(sample).map(([key, val]) => ({
        name: key,
        type: inferTsType(val),
    }));
}

function singularize(name) {
    if (name.endsWith("ies")) {
        return name.slice(0, -3) + "y"; // categories -> category
    }
    if (name.endsWith("s")) {
        return name.slice(0, -1);       // brands -> brand
    }
    return name;
}

// ---------- Main ----------
function main() {

    const collection = loadCollection();
    const entities = [];

    for (const entityItem of collection.item) {
        const entityName = entityItem.name; // "categories"

        // --- derive names ---
        const singular = singularize(entityName);
        const entity = singular.toLowerCase();
        const entitiesName = entityName.toLowerCase();

        const Entity = entity.charAt(0).toUpperCase() + entity.slice(1);
        const Entities = entitiesName.charAt(0).toUpperCase() + entitiesName.slice(1);

        const ENTITY_UPPER = entity.toUpperCase();
        const ENTITIES_UPPER = entitiesName.toUpperCase();

        // --- extract fields from postman ---
        const fields = extractModelFromResponse(entityItem);
        const createFields = extractCreateRequestFields(entityItem);

        // --- save for apiRoutes ---
        entities.push({
            lower: entity,
            upper: Entity,
            lowerPlural: entitiesName,
            upperPlural: ENTITIES_UPPER,
            ENTITY_UPPER,
        });

        const context = {
            Entity,
            Entities,
            entity,
            entities: entitiesName,
            ENTITY_UPPER,
            ENTITIES_UPPER,
            fields,
            createFields,
        };

        // --- mapping templates → output files ---
        const files = [
            { tpl: "types.hbs", out: `model/types.ts` },
            { tpl: "index.hbs", out: `index.ts` },
            { tpl: "form.hbs", out: `components/${Entity}Form.tsx` },
            { tpl: "table.hbs", out: `components/${Entities}Table.tsx` },
            { tpl: "page-list.hbs", out: `pages/${Entities}Page.tsx` },
            { tpl: "page-add.hbs", out: `pages/Add${Entity}Page.tsx` },
            { tpl: "page-edit.hbs", out: `pages/Edit${Entity}Page.tsx` },
        ];

        const featureDir = path.join(FEATURES_DIR, entitiesName);
        for (const f of files) {
            const content = renderTemplate(f.tpl, context);
            const target = path.join(featureDir, f.out);
            writeFile(target, content);
        }
    }

    // generate apiRoutes.ts
    const apiRoutesContent = renderTemplate("api-routes.hbs", { entities });
    writeFile(API_ROUTES_FILE, apiRoutesContent);

    // generate routes.ts
    const routesContent = renderTemplate("routes.hbs", { entities });
    writeFile(ROUTES_FILE, routesContent);

    console.log("🎉 Done!");
}

main();