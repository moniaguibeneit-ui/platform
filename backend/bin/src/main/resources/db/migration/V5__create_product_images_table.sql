-- V5 - Product images (multiple images per product, SAD 5.7.3)

CREATE TABLE product_images (
    image_id    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url   VARCHAR(500)  NOT NULL,
    sort_order  INTEGER       DEFAULT 0
);

CREATE TABLE product_image_links (
    product_id  UUID NOT NULL,
    image_id    UUID NOT NULL,
    PRIMARY KEY (product_id, image_id),
    CONSTRAINT fk_pil_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT fk_pil_image FOREIGN KEY (image_id) REFERENCES product_images (image_id) ON DELETE CASCADE
);
