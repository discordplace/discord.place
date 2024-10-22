'use server';

import fs from 'node:fs';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

export async function GET() {
  // get all .md files in /blogs directory
  const files = fs.readdirSync(`${process.cwd()}/blogs`).filter(file => file.endsWith('.md'));

  const data = files.map(file => {
    const content = fs.readFileSync(`${process.cwd()}/blogs/${file}`, 'utf8');

    return matter(content).data;
  });

  return NextResponse.json(data);
}