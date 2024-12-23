PGDMP      0                |            shop    16.3 (Debian 16.3-1.pgdg120+1)    16.3 #    ;           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            <           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            =           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            >           1262    32828    shop    DATABASE     o   CREATE DATABASE shop WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE shop;
                postgres    false            �            1259    32868 
   order_sets    TABLE     u   CREATE TABLE public.order_sets (
    id bigint NOT NULL,
    status text,
    user_id bigint,
    idcurier bigint
);
    DROP TABLE public.order_sets;
       public         heap    postgres    false            �            1259    32867    order_sets_id_seq    SEQUENCE     z   CREATE SEQUENCE public.order_sets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.order_sets_id_seq;
       public          postgres    false    222            ?           0    0    order_sets_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.order_sets_id_seq OWNED BY public.order_sets.id;
          public          postgres    false    221            �            1259    32850    orders    TABLE     �   CREATE TABLE public.orders (
    id bigint NOT NULL,
    order_status boolean,
    ad_status boolean,
    user_id bigint,
    order_set_id bigint
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    32849    orders_id_seq    SEQUENCE     v   CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public          postgres    false    220            @           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public          postgres    false    219            �            1259    32841    products    TABLE     �   CREATE TABLE public.products (
    id bigint NOT NULL,
    name text,
    description text,
    status text,
    order_id bigint
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    32840    products_id_seq    SEQUENCE     x   CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.products_id_seq;
       public          postgres    false    218            A           0    0    products_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
          public          postgres    false    217            �            1259    32830    users    TABLE     h   CREATE TABLE public.users (
    id bigint NOT NULL,
    login text,
    password text,
    role text
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    32829    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216            B           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            �           2604    32871    order_sets id    DEFAULT     n   ALTER TABLE ONLY public.order_sets ALTER COLUMN id SET DEFAULT nextval('public.order_sets_id_seq'::regclass);
 <   ALTER TABLE public.order_sets ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            �           2604    32853 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            �           2604    32844    products id    DEFAULT     j   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            �           2604    32833    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            8          0    32868 
   order_sets 
   TABLE DATA           C   COPY public.order_sets (id, status, user_id, idcurier) FROM stdin;
    public          postgres    false    222   !$       6          0    32850    orders 
   TABLE DATA           T   COPY public.orders (id, order_status, ad_status, user_id, order_set_id) FROM stdin;
    public          postgres    false    220   >$       4          0    32841    products 
   TABLE DATA           K   COPY public.products (id, name, description, status, order_id) FROM stdin;
    public          postgres    false    218   g$       2          0    32830    users 
   TABLE DATA           :   COPY public.users (id, login, password, role) FROM stdin;
    public          postgres    false    216   [&       C           0    0    order_sets_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.order_sets_id_seq', 11, true);
          public          postgres    false    221            D           0    0    orders_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.orders_id_seq', 11, true);
          public          postgres    false    219            E           0    0    products_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.products_id_seq', 30, true);
          public          postgres    false    217            F           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 4, true);
          public          postgres    false    215            �           2606    32875    order_sets order_sets_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.order_sets
    ADD CONSTRAINT order_sets_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.order_sets DROP CONSTRAINT order_sets_pkey;
       public            postgres    false    222            �           2606    32855    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    220            �           2606    32848    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    218            �           2606    32839    users uni_users_login 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT uni_users_login UNIQUE (login);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT uni_users_login;
       public            postgres    false    216            �           2606    32837    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �           2606    32876    orders fk_order_sets_orders    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_order_sets_orders FOREIGN KEY (order_set_id) REFERENCES public.order_sets(id);
 E   ALTER TABLE ONLY public.orders DROP CONSTRAINT fk_order_sets_orders;
       public          postgres    false    3231    222    220            �           2606    32856    products fk_orders_products    FK CONSTRAINT     |   ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_orders_products FOREIGN KEY (order_id) REFERENCES public.orders(id);
 E   ALTER TABLE ONLY public.products DROP CONSTRAINT fk_orders_products;
       public          postgres    false    3229    220    218            8      x������ � �      6      x�34�,�L�4������� $�      4   �  x��T�N�P|>���gcl���_��@�(A�[b�苯P����_��G�����CIXfgwf���5ƶʧ�1b��ȷ5[Gi�A�_b�=���
��������z��������;w쬣��5�Ppߞ� 㓳�~�<�5��m_.9�X�沇���,�l�TVu��������BFP�)K	��$�<^"%m&��$nΔ�w����$/��:�&;�g\'W�-�H�_䮽�U^���?Q)�H�Yܐ�&g��|�(�Uq�G��zt!ׂ8��Q����4k	!��m�:��g������7}������L<I�msxOޒ\��@j�c�G[P~�fv�'/�`�������3�?c��>���B�~�� �22�P���_c��z�w1�־ٮ��*�����pkSN1�,�*��\��RwB�mG@�q˞~�܏� ��]4�isg�Y,i�8�[��5g�o�ʆ�yD|�      2   }   x�3�LL����44261弰�{.츰����.6\�p��¾�\F�٩��E0��.���wa��N��]\Ɯ)���%�U[@�\�a+Ьv ��e�_Z��d���{��1z\\\ "�Gg     