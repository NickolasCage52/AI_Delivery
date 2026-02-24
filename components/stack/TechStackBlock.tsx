"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { TECH_CATEGORIES } from "@/lib/constants/tech-stack";

function TechItem({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.08] bg-[var(--bg-elevated)]/60 px-4 py-4 transition-colors hover:border-[var(--accent)]/20 hover:bg-[var(--bg-elevated)]/80">
      <span className="text-center text-sm font-medium text-[var(--text-primary)]">{name}</span>
    </div>
  );
}

function TechStackBlockInner() {
  return (
    <div className="space-y-12">
      <motion.h2
        className="text-2xl font-semibold tracking-tight md:text-3xl text-[var(--text-primary)]"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        Технологии, которые мы применяем
      </motion.h2>

      <p
        className="text-[var(--text-secondary)] max-w-2xl -mt-8"
      >
        Подбираем стек под задачу. ИИ-модели — для ботов, квалификации и автоматизации. Интеграции — для единого pipeline.
      </p>

      <div className="space-y-14">
        {TECH_CATEGORIES.map((category, catIndex) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: catIndex * 0.05 }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-6">
              {category.title}
            </h3>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {category.items.map((item) => (
                <TechItem key={item} name={item} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}

export const TechStackBlock = memo(TechStackBlockInner);
