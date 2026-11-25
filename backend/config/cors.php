<?php

return [

    // Seules les routes de l'API sont concernées
    'paths' => ['api/*'],

    // GET, POST, PUT, DELETE et OPTIONS (la requête de vérification du navigateur)
    'allowed_methods' => ['*'],

    // Seul ton frontend React est autorisé (localhost et 127.0.0.1 sont deux origines différentes)
    'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // false : on n'utilise pas de cookies pour l'instant
    'supports_credentials' => false,

];