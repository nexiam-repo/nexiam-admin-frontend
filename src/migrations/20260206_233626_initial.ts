import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TYPE "payload"."_locales" AS ENUM('en');
  CREATE TYPE "payload"."enum_users_roles" AS ENUM('super-admin', 'admin', 'editor');
  CREATE TYPE "payload"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_contact_us_industry" AS ENUM('Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Real Estate', 'Entertainment', 'Other', 'technology', 'finance', 'healthcare', 'education', 'manufacturing', 'retail', 'other');
  CREATE TYPE "payload"."enum_contact_us_source" AS ENUM('landing-page', 'other');
  CREATE TYPE "payload"."enum_contact_us_status" AS ENUM('new', 'in-progress', 'resolved', 'spam');
  CREATE TYPE "payload"."enum_contact_partner_industry" AS ENUM('Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Real Estate', 'Entertainment', 'Other', 'technology', 'finance', 'healthcare', 'education', 'manufacturing', 'retail', 'other');
  CREATE TYPE "payload"."enum_contact_partner_source" AS ENUM('landing-page', 'other');
  CREATE TYPE "payload"."enum_contact_partner_status" AS ENUM('new', 'in-progress', 'resolved', 'spam');
  CREATE TYPE "payload"."enum_contact_promote_industry" AS ENUM('Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Real Estate', 'Entertainment', 'Other', 'technology', 'finance', 'healthcare', 'education', 'manufacturing', 'retail', 'other');
  CREATE TYPE "payload"."enum_contact_promote_source" AS ENUM('landing-page', 'other');
  CREATE TYPE "payload"."enum_contact_promote_status" AS ENUM('new', 'in-progress', 'resolved', 'spam');
  CREATE TYPE "payload"."enum_waiting_list_source" AS ENUM('landing-page', 'other');
  CREATE TYPE "payload"."enum_waiting_list_status" AS ENUM('pending', 'notified');
  CREATE TABLE "payload"."users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "payload"."enum_users_roles",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."payload_api_users_allowed_origins" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"origin" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."payload_api_users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  CREATE TABLE "payload"."media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE "payload"."blog_posts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"slug" varchar NOT NULL,
  	"featured_image_id" uuid,
  	"author_id" uuid NOT NULL,
  	"status" "payload"."enum_blog_posts_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"seo_meta_image_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."blog_posts_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "payload"."contact_us" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company_name" varchar,
  	"country" varchar,
  	"industry" "payload"."enum_contact_us_industry",
  	"other_industry" varchar,
  	"message" varchar NOT NULL,
  	"source" "payload"."enum_contact_us_source" DEFAULT 'landing-page',
  	"status" "payload"."enum_contact_us_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."contact_partner" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company_name" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"industry" "payload"."enum_contact_partner_industry" NOT NULL,
  	"other_industry" varchar,
  	"message" varchar NOT NULL,
  	"source" "payload"."enum_contact_partner_source" DEFAULT 'landing-page',
  	"status" "payload"."enum_contact_partner_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."contact_promote" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company_name" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"industry" "payload"."enum_contact_promote_industry" NOT NULL,
  	"other_industry" varchar,
  	"message" varchar NOT NULL,
  	"source" "payload"."enum_contact_promote_source" DEFAULT 'landing-page',
  	"status" "payload"."enum_contact_promote_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."waiting_list" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar,
  	"email" varchar NOT NULL,
  	"source" "payload"."enum_waiting_list_source" DEFAULT 'landing-page',
  	"status" "payload"."enum_waiting_list_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"payload_api_users_id" uuid,
  	"media_id" uuid,
  	"blog_posts_id" uuid,
  	"contact_us_id" uuid,
  	"contact_partner_id" uuid,
  	"contact_promote_id" uuid,
  	"waiting_list_id" uuid
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"payload_api_users_id" uuid
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."email_templates" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"waiting_list_enabled" boolean DEFAULT true,
  	"waiting_list_subject" varchar DEFAULT 'You''re on the waitlist! 🎉',
  	"waiting_list_from_email" varchar,
  	"waiting_list_from_name" varchar DEFAULT 'Nexiam Support',
  	"waiting_list_mjml" varchar DEFAULT '<mjml>
    <mj-head>
      <mj-attributes>
        <mj-all font-family="Arial, sans-serif" />
        <mj-text font-size="14px" color="#333333" line-height="1.6" />
      </mj-attributes>
    </mj-head>
    <mj-body background-color="#f4f4f5">
      <mj-section padding="20px 0">
        <mj-column>
          <mj-text align="center" font-size="24px" color="#4F46E5" font-weight="bold">
            Welcome!
          </mj-text>
          <mj-text>Hi {{name}}</mj-text>
          <mj-text>
            Thanks for joining our waitlist. We''re working hard to launch something amazing, and you''ll be among the first to know when we''re ready.
          </mj-text>
          <mj-text>We''ll send you an email as soon as we launch.</mj-text>
          <mj-text padding-top="30px">
            &mdash; Nexiam Support
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>',
  	"waiting_list_text_body" varchar DEFAULT 'Welcome!
  
  
  Hi {{name}}
  
  
  Thanks for joining our waitlist. We''re working hard to launch something amazing, and you''ll be among the first to know when we''re ready.
  
  
  We''ll send you an email as soon as we launch.
  
  
  &mdash; Nexiam Support',
  	"waiting_list_html_body" varchar DEFAULT '
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>You''re on the waitlist!</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding: 0; }
      body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      p { display: block; margin: 13px 0; }
    </style>
    </head>
  <body style="word-spacing:normal;background-color:#f4f4f5;">
    <div style="background-color:#f4f4f5;">
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:24px;font-weight:bold;line-height:1.6;text-align:center;color:#4F46E5;">Welcome!</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1.6;text-align:left;color:#333333;">Hi {{name}}</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1.6;text-align:left;color:#333333;">Thanks for joining our waitlist. We''re working hard to launch something amazing, and you''ll be among the first to know when we''re ready.</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1.6;text-align:left;color:#333333;">We''ll send you an email as soon as we launch.</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1.6;text-align:left;color:#333333;">&mdash; Nexiam Support</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
  </html>
  ',
  	"contact_form_enabled" boolean DEFAULT true,
  	"contact_form_subject" varchar DEFAULT 'Thanks for reaching out!',
  	"contact_form_from_email" varchar,
  	"contact_form_from_name" varchar DEFAULT 'Nexiam Support',
  	"contact_form_mjml" varchar DEFAULT '<mjml>
    <mj-head>
      <mj-attributes>
        <mj-all font-family="Arial, sans-serif" />
        <mj-text font-size="14px" color="#333333" line-height="1.6" />
      </mj-attributes>
    </mj-head>
    <mj-body background-color="#f4f4f5">
      <mj-section padding="20px 0">
        <mj-column>
          <mj-text align="center" font-size="24px" color="#4F46E5" font-weight="bold">
            Message Received
          </mj-text>
          <mj-text>Hi {{name}}</mj-text>
          <mj-text>
            Thank you for reaching out to us! Your request has been successfully received. Our team will review the details and will get back to you shortly.
          </mj-text>
          <mj-text padding-top="30px">
            &mdash; Nexiam Support
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>',
  	"contact_form_text_body" varchar DEFAULT 'Message Received
  
  
  Hi {{name}}
  
  
  Thank you for reaching out to us! Your request has been successfully received. Our team will review the details and will get back to you shortly.
  
  
  
  &mdash; Nexiam Support',
  	"contact_form_html_body" varchar DEFAULT '
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>Thanks for reaching out!</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding: 0; }
      body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      p { display: block; margin: 13px 0; }
    </style>
    </head>
  <body style="word-spacing:normal;background-color:#f4f4f5;">
    <div style="background-color:#f4f4f5;">
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:24px;font-weight:bold;line-height:1.6;text-align:center;color:#4F46E5;">Message Received</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1.6;text-align:left;color:#333333;">Hi {{name}}</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1.6;text-align:left;color:#333333;">Thank you for reaching out to us! Your request has been successfully received. Our team will review the details and will get back to you shortly.</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                          <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1.6;text-align:left;color:#333333;">&mdash; Nexiam Support</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
  </html>
  ',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_api_users_allowed_origins" ADD CONSTRAINT "payload_api_users_allowed_origins_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."payload_api_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."blog_posts" ADD CONSTRAINT "blog_posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."blog_posts" ADD CONSTRAINT "blog_posts_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."blog_posts_locales" ADD CONSTRAINT "blog_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_api_users_fk" FOREIGN KEY ("payload_api_users_id") REFERENCES "payload"."payload_api_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "payload"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_us_fk" FOREIGN KEY ("contact_us_id") REFERENCES "payload"."contact_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_partner_fk" FOREIGN KEY ("contact_partner_id") REFERENCES "payload"."contact_partner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_promote_fk" FOREIGN KEY ("contact_promote_id") REFERENCES "payload"."contact_promote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_waiting_list_fk" FOREIGN KEY ("waiting_list_id") REFERENCES "payload"."waiting_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_api_users_fk" FOREIGN KEY ("payload_api_users_id") REFERENCES "payload"."payload_api_users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "payload"."users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "payload"."users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "payload_api_users_allowed_origins_order_idx" ON "payload"."payload_api_users_allowed_origins" USING btree ("_order");
  CREATE INDEX "payload_api_users_allowed_origins_parent_id_idx" ON "payload"."payload_api_users_allowed_origins" USING btree ("_parent_id");
  CREATE INDEX "payload_api_users_updated_at_idx" ON "payload"."payload_api_users" USING btree ("updated_at");
  CREATE INDEX "payload_api_users_created_at_idx" ON "payload"."payload_api_users" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "payload"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "payload"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "payload"."media" USING btree ("sizes_tablet_filename");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "payload"."blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_featured_image_idx" ON "payload"."blog_posts" USING btree ("featured_image_id");
  CREATE INDEX "blog_posts_author_idx" ON "payload"."blog_posts" USING btree ("author_id");
  CREATE INDEX "blog_posts_seo_seo_meta_image_idx" ON "payload"."blog_posts" USING btree ("seo_meta_image_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "payload"."blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "payload"."blog_posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_posts_locales_locale_parent_id_unique" ON "payload"."blog_posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_us_updated_at_idx" ON "payload"."contact_us" USING btree ("updated_at");
  CREATE INDEX "contact_us_created_at_idx" ON "payload"."contact_us" USING btree ("created_at");
  CREATE INDEX "contact_partner_updated_at_idx" ON "payload"."contact_partner" USING btree ("updated_at");
  CREATE INDEX "contact_partner_created_at_idx" ON "payload"."contact_partner" USING btree ("created_at");
  CREATE INDEX "contact_promote_updated_at_idx" ON "payload"."contact_promote" USING btree ("updated_at");
  CREATE INDEX "contact_promote_created_at_idx" ON "payload"."contact_promote" USING btree ("created_at");
  CREATE UNIQUE INDEX "waiting_list_email_idx" ON "payload"."waiting_list" USING btree ("email");
  CREATE INDEX "waiting_list_updated_at_idx" ON "payload"."waiting_list" USING btree ("updated_at");
  CREATE INDEX "waiting_list_created_at_idx" ON "payload"."waiting_list" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_api_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("payload_api_users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_contact_us_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("contact_us_id");
  CREATE INDEX "payload_locked_documents_rels_contact_partner_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("contact_partner_id");
  CREATE INDEX "payload_locked_documents_rels_contact_promote_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("contact_promote_id");
  CREATE INDEX "payload_locked_documents_rels_waiting_list_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("waiting_list_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_payload_api_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("payload_api_users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   DROP TABLE "payload"."users_roles" CASCADE;
  DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."payload_api_users_allowed_origins" CASCADE;
  DROP TABLE "payload"."payload_api_users" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."blog_posts" CASCADE;
  DROP TABLE "payload"."blog_posts_locales" CASCADE;
  DROP TABLE "payload"."contact_us" CASCADE;
  DROP TABLE "payload"."contact_partner" CASCADE;
  DROP TABLE "payload"."contact_promote" CASCADE;
  DROP TABLE "payload"."waiting_list" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."email_templates" CASCADE;
  DROP TYPE "payload"."_locales";
  DROP TYPE "payload"."enum_users_roles";
  DROP TYPE "payload"."enum_blog_posts_status";
  DROP TYPE "payload"."enum_contact_us_industry";
  DROP TYPE "payload"."enum_contact_us_source";
  DROP TYPE "payload"."enum_contact_us_status";
  DROP TYPE "payload"."enum_contact_partner_industry";
  DROP TYPE "payload"."enum_contact_partner_source";
  DROP TYPE "payload"."enum_contact_partner_status";
  DROP TYPE "payload"."enum_contact_promote_industry";
  DROP TYPE "payload"."enum_contact_promote_source";
  DROP TYPE "payload"."enum_contact_promote_status";
  DROP TYPE "payload"."enum_waiting_list_source";
  DROP TYPE "payload"."enum_waiting_list_status";`);
}
