import type { CollectionConfig, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateCourse, revalidateCourseDelete } from './hooks/revalidateCourse'

// Reusable quiz definition, used for both per-module quizzes and the course-level
// final assessment. Auto-graded MCQ (single or multiple correct).
const quizGroup = (name: string, label: string, description: string): Field => ({
  name,
  type: 'group',
  label,
  admin: { description },
  fields: [
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'If on, learners must reach the pass mark here before the next module unlocks. Leave off for an optional quiz.',
      },
    },
    {
      name: 'passMark',
      type: 'number',
      defaultValue: 70,
      min: 0,
      max: 100,
      admin: { description: 'Minimum percentage to pass.' },
    },
    {
      name: 'questions',
      type: 'array',
      labels: { singular: 'Question', plural: 'Questions' },
      admin: { description: 'Leave empty for no quiz.' },
      fields: [
        { name: 'question', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'single',
          options: [
            { label: 'Single correct answer', value: 'single' },
            { label: 'Multiple correct answers', value: 'multiple' },
          ],
        },
        {
          name: 'options',
          type: 'array',
          minRows: 2,
          labels: { singular: 'Option', plural: 'Options' },
          admin: { description: 'Tick every option that is correct.' },
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'correct', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
  ],
})

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: {
    singular: 'Course',
    plural: 'Courses',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    summary: true,
    price: true,
    currency: true,
    duration: true,
    level: true,
    mode: true,
    icon: true,
    featured: true,
    heroImage: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'price', 'level', 'featured', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'courses',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'courses',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One- or two-line description shown on course cards.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              label: 'Full description',
            },
          ],
        },
        {
          label: 'Curriculum',
          fields: [
            {
              name: 'curriculum',
              type: 'array',
              labels: {
                singular: 'Module',
                plural: 'Modules',
              },
              admin: {
                description: 'Break the course into modules; each lists its topics.',
              },
              fields: [
                {
                  name: 'moduleTitle',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'lessons',
                  type: 'array',
                  fields: [
                    {
                      name: 'lesson',
                      type: 'text',
                      required: true,
                      label: 'Lesson title',
                    },
                    {
                      name: 'content',
                      type: 'richText',
                      editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                          ...rootFeatures,
                          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
                          FixedToolbarFeature(),
                          InlineToolbarFeature(),
                          HorizontalRuleFeature(),
                        ],
                      }),
                      admin: {
                        description: 'Self-paced lesson body shown to enrolled students.',
                      },
                    },
                    {
                      name: 'tryIt',
                      type: 'textarea',
                      label: 'Try it yourself',
                      admin: {
                        description:
                          'Optional hands-on exercise shown in a highlighted box at the end of the lesson.',
                      },
                    },
                    {
                      name: 'videoUrl',
                      type: 'text',
                      admin: {
                        description:
                          'Optional video — paste a YouTube/Vimeo link or a direct .mp4 URL.',
                      },
                    },
                    {
                      name: 'preview',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Free preview — viewable without enrolling.',
                      },
                    },
                  ],
                },
                quizGroup(
                  'quiz',
                  'Module quiz',
                  'Optional quiz shown at the end of this module.',
                ),
              ],
            },
            quizGroup(
              'finalAssessment',
              'Final assessment',
              'Optional assessment shown at the end of the course.',
            ),
            {
              name: 'outcomes',
              type: 'array',
              label: 'What you will learn',
              fields: [
                {
                  name: 'outcome',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Enrollment price. Use 0 for free courses.',
      },
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'INR',
      options: [
        { label: '₹ INR', value: 'INR' },
        { label: '$ USD', value: 'USD' },
        { label: '€ EUR', value: 'EUR' },
        { label: '£ GBP', value: 'GBP' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'e.g. "12 weeks" or "40 hours".',
      },
    },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'beginner',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'All levels', value: 'all' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'live',
      options: [
        { label: 'Live (instructor-led)', value: 'live' },
        { label: 'Self-paced', value: 'self-paced' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'code',
      admin: {
        position: 'sidebar',
        description: 'Icon shown on the course card.',
      },
      options: [
        { label: 'Code', value: 'code' },
        { label: 'Web', value: 'globe' },
        { label: 'Data / chart', value: 'chart' },
        { label: 'AI / brain', value: 'brain' },
        { label: 'Cloud', value: 'cloud' },
        { label: 'Mobile', value: 'smartphone' },
        { label: 'Security', value: 'shield' },
        { label: 'Database', value: 'database' },
        { label: 'Design', value: 'palette' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this course on the homepage.',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateCourse],
    afterDelete: [revalidateCourseDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
