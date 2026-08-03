# VulcanForge UI — Guide d’utilisation pour les testeurs

**Version du guide :** 1.1  
**Date :** 3 août 2026  
**Périmètre :** application VulcanForge UI avant le parcours final DS-170-08  
**Public :** testeurs fonctionnels, testeurs UX, parties prenantes et utilisateurs découvrant les design systems

> Ce document explique comment prendre en main l’application et utiliser chaque espace fonctionnel. Il ne remplace pas le protocole de recette : les anomalies doivent être consignées séparément avec leurs étapes de reproduction.

Les sections éditables comportent désormais des explications de champ fondées sur quatre questions : **à quoi sert le champ**, **que faut-il saisir**, **où la donnée est-elle réutilisée** et **comment vérifier son effet**. L’objectif n’est pas seulement de réussir la saisie, mais de comprendre la décision de design ou de produit représentée par chaque valeur.

---

## 1. Informations de test à compléter

Avant de distribuer ce guide, l’équipe de test doit renseigner les informations suivantes :

| Information                                    | Valeur          |
| ---------------------------------------------- | --------------- |
| URL de l’environnement                         | `[à compléter]` |
| Navigateurs officiellement couverts            | `[à compléter]` |
| Compte de test fourni, le cas échéant          | `[à compléter]` |
| Contact en cas de blocage                      | `[à compléter]` |
| Outil ou emplacement de remontée des anomalies | `[à compléter]` |
| Jeu de données partagé à ne pas modifier       | `[à compléter]` |

Pour toute opération destructive, utilisez exclusivement un compte et un projet jetables explicitement créés pour le test.

---

## 2. Comprendre VulcanForge UI

VulcanForge UI est une application de création et de gestion de design systems. Elle permet de centraliser, dans un projet structuré :

- l’identité du produit et ses règles éditoriales ;
- les design tokens ;
- les thèmes clair et sombre ;
- les contrats des composants d’interface ;
- des contrôles automatisés d’accessibilité ;
- la documentation générée ;
- les instructions destinées aux assistants de développement par IA ;
- plusieurs formats d’export pour le Web et le mobile.

L’objectif n’est pas seulement de stocker des couleurs ou des composants. Les informations saisies dans un espace alimentent les autres espaces. Par exemple :

- un token couleur peut être associé à un rôle de thème ;
- un composant peut référencer des tokens existants ;
- les contrôles d’accessibilité analysent les tokens, les thèmes et les composants ;
- la documentation et les instructions IA sont générées à partir des données du projet ;
- une modification de Brand, Tokens, Themes ou Components peut rendre un ancien export obsolète.

### Ordre de prise en main recommandé

Pour découvrir l’application sans rencontrer trop d’états incomplets, suivez cet ordre :

1. créer un compte ou se connecter ;
2. créer un projet ;
3. compléter **Brand** ;
4. créer ou corriger les **Tokens** ;
5. configurer les **Themes** ;
6. documenter les **Components** ;
7. examiner **Accessibility** ;
8. générer **Documentation** ;
9. générer **AI Instructions** ;
10. utiliser **Exports** ;
11. vérifier les paramètres du projet et du compte.

---

## 3. Vocabulaire essentiel

### Design system

Ensemble cohérent de règles, de valeurs et de composants utilisés pour concevoir et développer un produit numérique. Il favorise la cohérence visuelle, l’accessibilité et la réutilisation.

### Design token

Valeur nommée représentant une décision de design. Au lieu d’écrire directement `#4F46E5`, on peut utiliser un chemin tel que `color.semantic.action.background`.

### Chemin de token

Identifiant technique d’un token, composé de lettres, chiffres, points, tirets ou underscores. Exemples :

```text
color.primitive.indigo.600
color.semantic.content.primary
spacing.4
radius.control.md
motion.duration.fast
```

Le chemin doit être unique dans son jeu de tokens.

### Token primitif

Valeur de base, généralement proche d’une valeur brute. Exemple : une nuance de couleur précise avec sa valeur HEX.

### Token sémantique

Valeur nommée selon son usage dans l’interface. Un token sémantique couleur référence un token primitif, par exemple un arrière-plan d’action qui pointe vers une nuance indigo.

### Référence ou alias

Lien d’un token ou d’un composant vers un autre token. La référence permet de modifier une valeur primitive tout en mettant à jour tous ses usages.

### Thème

Association entre des rôles d’interface et des tokens. VulcanForge UI gère notamment des modes clair et sombre.

### Rôle de thème

Fonction d’une couleur dans l’interface : arrière-plan, surface, contenu, accent, bordure, etc. Un rôle reçoit une référence vers un token couleur existant.

### Contrat de composant

Description structurée du comportement attendu d’un composant : finalité, anatomie, variantes, tailles, états, règles d’accessibilité, usages interdits et tokens associés.

### Statut

Certains objets utilisent les statuts suivants :

- **Draft / Brouillon** : travail en cours ;
- **Ready / Prêt** : suffisamment documenté pour être utilisé ;
- **Deprecated / Déprécié** : conservé pour compatibilité, mais à ne plus adopter.

### Langue de l’interface

Langue des menus, boutons et messages de l’application. Elle peut être française ou anglaise.

### Langue du contenu

Langue des informations métier saisies dans Brand, Components, Documentation ou AI Instructions. Elle est indépendante de la langue de l’interface.

Exemple : l’interface peut être en français tandis que vous éditez le contenu anglais d’un composant.

### Langue par défaut et fallback

La langue par défaut du projet sert de solution de repli lorsqu’un contenu n’existe pas dans la langue demandée. L’application signale les traductions manquantes, mais certains enregistrements et certaines générations restent possibles grâce à ce fallback.

### Export obsolète

Export généré avec succès, mais antérieur à une modification pertinente du projet. Il doit être régénéré pour refléter les données actuelles.

---

## 4. Préparer une session de test

### Recommandations générales

- Utilisez un navigateur récent.
- Autorisez les téléchargements lorsque vous testez Documentation, AI Instructions ou Exports.
- Autorisez l’accès au presse-papiers lorsque vous testez les actions de copie.
- N’utilisez pas de véritable mot de passe personnel.
- Évitez les données confidentielles dans les noms, descriptions et captures d’écran.
- Notez la langue de l’interface, le thème, la largeur de fenêtre et le navigateur avant de signaler une anomalie.

### Configurations à couvrir

Pour une recette complète, répétez les interactions principales dans les contextes suivants :

- interface française puis anglaise ;
- apparence claire puis sombre ;
- largeur desktop ;
- largeur tablette ;
- largeur mobile proche de 390 px ;
- navigation à la souris ;
- navigation au clavier.

### Vérifications au clavier

Les comportements attendus varient selon le contrôle :

- `Tab` et `Maj + Tab` déplacent le focus ;
- `Entrée` ou `Espace` activent un bouton ;
- les flèches naviguent dans les groupes segmentés, listes et groupes radio ;
- `Échap` ferme les menus, listes déroulantes et dialogues compatibles ;
- après fermeture avec `Échap`, le focus doit revenir au contrôle qui a ouvert l’élément.

Le focus doit rester visible.

---

## 5. Créer un compte et se connecter

### 5.1 Créer un compte

Depuis la page publique, ouvrez **Sign up / Créer un compte**.

### Comprendre les champs du compte

**Nom**

- **Utilité :** identifie l’utilisateur dans l’application et sert à nommer son espace de travail personnel initial.
- **À saisir :** un nom d’affichage compréhensible, entre 2 et 80 caractères. Pour un test, utilisez un pseudonyme ou un nom de test plutôt qu’une donnée personnelle réelle.
- **Réutilisation :** menu utilisateur, paramètres du compte et nom initial de l’espace personnel.
- **Vérification :** terminer l’inscription, puis ouvrir le menu utilisateur et les paramètres du compte.

**E-mail**

- **Utilité :** constitue l’identifiant de connexion unique du compte.
- **À saisir :** une adresse valide qui n’est pas déjà utilisée dans l’environnement de test.
- **Réutilisation :** connexion, modification ultérieure de l’adresse et confirmation de suppression du compte.
- **Vérification :** se déconnecter, puis se reconnecter avec cette adresse.

**Mot de passe**

- **Utilité :** protège l’accès au compte et confirme certaines opérations sensibles.
- **À saisir :** une valeur de test comprise entre 12 et 72 caractères, différente d’un mot de passe personnel réel.
- **Réutilisation :** connexion, changement d’adresse e-mail et suppression du compte.
- **Vérification :** utiliser l’icône d’affichage, terminer l’inscription, puis vérifier qu’une connexion est possible.

**Confirmation du mot de passe**

- **Utilité :** évite la création d’un compte avec un mot de passe saisi par erreur.
- **À saisir :** exactement la même valeur que dans le champ Mot de passe.
- **Réutilisation :** uniquement pendant la validation de l’inscription ; la confirmation n’est pas enregistrée comme donnée distincte.
- **Vérification :** saisir volontairement une valeur différente pour vérifier le message d’erreur, puis corriger.

Les icônes situées dans les champs de mot de passe permettent d’afficher ou de masquer la valeur saisie.

Après la création :

- un espace de travail personnel est créé automatiquement ;
- les préférences initiales utilisent la langue courante et l’apparence système ;
- l’utilisateur est connecté et redirigé vers le Dashboard.

### 5.2 Se connecter

Depuis **Sign in / Se connecter**, renseignez l’adresse e-mail et le mot de passe du compte.

Une tentative d’accès direct à une page authentifiée sans session valide renvoie vers la page de connexion avec un message indiquant qu’une authentification est nécessaire.

### 5.3 Se déconnecter

Sur desktop :

1. ouvrez le menu utilisateur dans la barre supérieure ;
2. choisissez **Sign out / Se déconnecter**.

Sur mobile ou tablette :

1. ouvrez le menu burger ;
2. choisissez **Sign out / Se déconnecter**.

---

## 6. Se repérer dans l’application

## 6.1 Dashboard

Le Dashboard est la collection principale des projets accessibles à l’utilisateur. Il permet notamment :

- de voir les projets disponibles ;
- d’ouvrir un projet ;
- de lancer la création d’un nouveau projet.

L’ouverture standard d’un projet mène à son espace **Overview**.

Il n’existe pas de seconde page « Projects » distincte : le Dashboard est la surface de référence pour la collection de projets.

## 6.2 Barre supérieure

La barre supérieure peut contenir :

- l’identité de l’espace de travail ;
- le sélecteur de projet ;
- le sélecteur de langue de l’interface ;
- le menu utilisateur ;
- sur les petits écrans, un menu burger qui regroupe navigation, langue et compte.

### Identité de l’espace de travail

Le nom de l’espace est un contexte informatif. Il n’est pas encore possible de changer d’espace de travail depuis ce contrôle : l’absence de menu ou de chevron est intentionnelle.

### Sélecteur de projet

Le sélecteur de projet affiche les projets accessibles et identifie le projet courant.

Lors d’un changement de projet, l’application tente de conserver le contexte :

- Themes reste sur Themes ;
- Documentation reste sur Documentation ;
- une sous-page de Components revient à la racine Components du projet cible ;
- Tokens conserve la famille active lorsqu’elle est prise en charge ;
- Overview reste sur Overview.

Une action permet également de revenir à la collection du Dashboard.

### Sélecteur de langue

Le sélecteur FR/EN modifie la langue de l’interface en conservant autant que possible la page courante.

Il ne modifie pas automatiquement la langue du contenu édité dans Brand, Components, Documentation ou AI Instructions.

## 6.3 Navigation du projet

Les espaces de projet sont :

- **Overview** ;
- **Brand** ;
- **Tokens** ;
- **Themes** ;
- **Components** ;
- **Accessibility** ;
- **Documentation** ;
- **Exports** ;
- **AI Instructions** ;
- **Settings** du projet.

Sur desktop, ils apparaissent dans la navigation persistante. Sur les écrans plus étroits, ils sont disponibles dans le menu burger.

## 6.4 Deux espaces « Settings » différents

Il existe deux destinations distinctes :

- **Paramètres du compte** : accessibles depuis le menu utilisateur ou le menu burger ;
- **Paramètres du projet** : accessibles dans la navigation du projet.

Les paramètres du compte concernent l’identité de connexion, les préférences et la suppression du compte. Les paramètres du projet concernent l’identité et la suppression du projet courant.

## 6.5 États d’enregistrement

Selon les pages, l’application peut afficher :

- **Saved / Enregistré** ;
- **Unsaved / Non enregistré** ;
- **Saving / Enregistrement** ;
- **Invalid / Invalide** ;
- un état d’erreur.

Ne quittez pas une page tant que l’état est « Saving ». Lorsque l’état est « Unsaved », utilisez l’action Save avant de naviguer, sauf si le scénario teste volontairement la perte ou la conservation du contexte.

---

## 7. Créer un projet de design system

Depuis le Dashboard, lancez la création d’un nouveau projet. L’assistant comporte cinq étapes.

## 7.1 Étape 1 — Informations de base

### Nom du projet

- **Utilité :** donne au design system son identité canonique dans le Dashboard, la navigation, Overview et les contenus générés.
- **À saisir :** un nom précis permettant de distinguer le produit ou le design system, entre 2 et 80 caractères. Évitez les noms génériques tels que « Test » lorsque plusieurs testeurs travaillent dans le même environnement.
- **Réutilisation :** Brand, sélecteur de projet, documentation, instructions IA, exports et confirmations destructives.
- **Vérification :** terminer la création puis contrôler le nom dans le sélecteur de projet et Overview.

### Description

- **Utilité :** résume le périmètre du projet avant que le profil Brand détaillé soit complété.
- **À saisir :** une phrase courte décrivant le produit, ses utilisateurs et, si utile, ses plateformes. Le champ est facultatif et limité à 240 caractères.
- **Réutilisation :** surfaces de synthèse du projet lorsque cette information est disponible.
- **Vérification :** ouvrir le projet depuis le Dashboard et examiner ses informations de synthèse.

Un slug technique est généré lors de la création. Il sert aux URL et reste distinct du nom affiché.

## 7.2 Étape 2 — Plateformes et langues

### Plateformes

Sélectionnez au moins une plateforme :

- Web ;
- Mobile.

**Utilité :** indique le périmètre technique visé par le design system. Ce choix décrit les environnements auxquels les décisions de design sont destinées ; il ne transforme pas automatiquement une règle Web en règle mobile.

**À sélectionner :** Web, Mobile ou les deux lorsque le même design system doit alimenter plusieurs produits.

**Réutilisation :** métadonnées du projet et sorties générées qui présentent le périmètre du design system.

**Vérification :** terminer la création et rechercher les plateformes dans les informations du projet ou les contenus générés qui les exposent.

### Langues prises en charge

Le projet peut prendre en charge le français, l’anglais ou les deux.

**Utilité :** détermine les langues métier qui doivent être documentées dans Brand, Tokens, Components, Documentation et AI Instructions.

**À sélectionner :** uniquement les langues que l’équipe prévoit réellement de maintenir. Sélectionnez au moins une langue.

**Réutilisation :** sélecteurs de langue de contenu, diagnostics de traduction, documentation et instructions IA.

**Vérification :** après création, ouvrir Brand ou Components et contrôler les langues proposées pour la saisie.

### Langue par défaut

**Utilité :** sert de langue de référence et de fallback lorsqu’une traduction est absente.

**À sélectionner :** la langue dans laquelle les contenus seront maintenus en priorité. Elle doit obligatoirement appartenir aux langues prises en charge.

**Réutilisation :** résolution des contenus localisés incomplets et signalement des fallbacks dans les générateurs.

**Vérification :** laisser volontairement une traduction secondaire vide, puis examiner les diagnostics de Documentation ou AI Instructions.

## 7.3 Étape 3 — Direction visuelle

Choisissez une direction parmi :

- minimal ;
- premium ;
- editorial ;
- technical ;
- playful ;
- bold ;
- neutral ;
- custom.

**Utilité :** exprime l’intention esthétique générale du produit avant la définition détaillée des tokens et composants.

**À sélectionner :** la direction qui décrit le mieux l’effet recherché : minimal, premium, editorial, technical, playful, bold, neutral ou custom. Choisissez Custom lorsque les catégories proposées ne décrivent pas correctement le projet.

**Réutilisation :** initialise la direction visuelle du profil Brand et peut être intégrée aux contenus générés.

**Vérification :** ouvrir Brand après la création et contrôler la direction sélectionnée.

Ce choix constitue une directive structurée. Il ne modifie pas automatiquement l’apparence de VulcanForge UI et peut ensuite être modifié dans Brand.

## 7.4 Étape 4 — Cible d’accessibilité

Choisissez :

- **WCAG AA** ;
- **WCAG AAA**.

**Utilité :** documente le niveau d’ambition retenu pour les décisions d’accessibilité et les contrastes du projet.

**À sélectionner :** WCAG AA pour la cible courante de nombreux produits, ou WCAG AAA lorsque le projet vise des exigences de contraste plus élevées. Le choix doit correspondre à une décision réelle de l’équipe, pas à la valeur qui semble la plus avantageuse.

**Réutilisation :** métadonnées du projet et analyses d’accessibilité qui prennent en compte la cible configurée.

**Vérification :** ouvrir Accessibility et Themes, puis examiner les niveaux de contraste affichés.

Cette sélection exprime un objectif. Elle ne constitue ni une certification automatique ni un remplacement de l’audit manuel.

## 7.5 Étape 5 — Vérification

Relisez le récapitulatif. Les étapes déjà visitées peuvent être rouvertes pour correction.

La création n’est effectuée qu’après activation explicite de l’action finale **Create project / Créer le projet**.

## 7.6 Après la création

Le nouveau projet s’ouvre dans l’application. Les structures fondamentales nécessaires aux espaces Brand, Tokens, Themes, Components, Documentation, AI Instructions et Exports sont initialisées.

Commencez par examiner Overview, puis complétez Brand et les Tokens.

---

## 8. Overview — Comprendre l’état du projet

Overview est une synthèse en lecture seule. Il ne permet pas d’éditer directement les données.

Il agrège les informations existantes provenant de :

- Brand ;
- Tokens ;
- Themes ;
- Components ;
- Accessibility ;
- Documentation ;
- AI Instructions ;
- Exports.

## 8.1 Contenu principal

Selon les données disponibles, Overview présente :

- l’identité et les métadonnées du projet ;
- un score indicatif de santé ;
- des métriques principales ;
- des actions recommandées ;
- des résumés Tokens, Themes, Components et Exports ;
- une activité récente fondée sur de véritables dates de mise à jour et journaux d’export ;
- sur les écrans très larges, un aperçu des thèmes.

## 8.2 Actions recommandées

L’application affiche au maximum quatre actions prioritaires. Elles peuvent signaler :

- des données invalides ;
- des contrastes insuffisants ;
- des traductions manquantes ;
- l’absence de thème ;
- des contrats de composants incomplets ou en brouillon ;
- des exports jamais générés ou devenus obsolètes.

Chaque action mène à l’espace concerné.

## 8.3 Score indicatif

Le score sert à prioriser les corrections. Il ne représente pas un pourcentage de conformité WCAG et ne remplace pas un audit manuel.

## 8.4 Activité récente

L’activité peut provenir :

- de la mise à jour d’un jeu de tokens ;
- de la mise à jour d’un thème ;
- de la mise à jour d’un contrat de composant ;
- de l’enregistrement d’un rapport d’accessibilité ;
- d’un export.

Aucune activité fictive ne doit être affichée lorsqu’aucune donnée réelle n’est disponible.

---

## 9. Brand — Définir l’identité du produit

Brand est la source de référence pour l’identité et les règles éditoriales du projet.

Les données Brand alimentent notamment Documentation, AI Instructions et certains exports.

## 9.1 Identité globale

### Nom du produit

Le nom est la dénomination canonique du projet. Une modification est répercutée dans les autres espaces concernés.

### Slug

Le slug est un identifiant technique en lecture seule. Modifier le nom du produit ne modifie pas le slug existant. Ce comportement est intentionnel afin de préserver les URL.

## 9.2 Langue du contenu Brand

La barre de langue de contenu permet de choisir la version française ou anglaise à éditer, uniquement parmi les langues prises en charge par le projet.

Ce choix est indépendant du sélecteur de langue de l’interface.

Exemple :

- interface en français ;
- contenu Brand actuellement édité en anglais.

## 9.3 Comprendre les champs localisés

Chaque champ doit être renseigné dans la langue de contenu actuellement sélectionnée. Une traduction doit transmettre la même intention, sans nécessairement reproduire mot pour mot la version source.

### Tagline / Signature

- **Utilité :** formule la promesse ou le positionnement du produit en une expression mémorable.
- **À saisir :** une phrase très courte orientée vers la valeur apportée à l’utilisateur. Évitez une simple répétition du nom du produit.
- **Réutilisation :** documentation et sorties de marque lorsque la signature est disponible.
- **Vérification :** enregistrer Brand, puis générer Documentation dans la langue concernée et rechercher la signature.

### Short description / Description courte

- **Utilité :** fournit un résumé immédiatement compréhensible du produit, plus informatif que la tagline mais plus court qu’une présentation complète.
- **À saisir :** une ou deux phrases indiquant ce que fait le produit, pour qui et avec quel bénéfice principal.
- **Réutilisation :** synthèses du projet, Documentation, AI Instructions et autres sorties utilisant l’identité Brand, avec fallback si nécessaire.
- **Vérification :** enregistrer, puis consulter Overview et générer Documentation dans les deux langues.

### Personality / Personnalité

- **Utilité :** décrit les traits humains que le produit doit évoquer. Elle répond à la question « Quelle impression le produit donne-t-il ? ».
- **À saisir :** quelques adjectifs ou une phrase courte, par exemple « fiable, directe et rassurante ». Ne décrivez pas ici des règles de rédaction détaillées.
- **Réutilisation :** contexte de marque transmis à Documentation et AI Instructions.
- **Vérification :** générer AI Instructions et contrôler que l’identité du produit reflète les traits saisis.

### Audience / Public cible

- **Utilité :** précise les personnes pour lesquelles le produit est conçu et aide à évaluer si le vocabulaire, la densité et les composants sont adaptés.
- **À saisir :** les utilisateurs finaux principaux et, lorsque c’est pertinent, les professionnels qui utilisent le produit. Évitez « tout le monde ».
- **Réutilisation :** documentation du projet et contexte fourni aux instructions IA.
- **Vérification :** générer Documentation ou AI Instructions et rechercher la description du public.

### Tone of voice / Ton de voix

- **Utilité :** décrit la manière dont le produit s’adresse aux utilisateurs. Il répond à la question « Comment le produit parle-t-il ? », contrairement à la personnalité qui décrit l’impression générale.
- **À saisir :** des consignes de style telles que « concis, utile, calme et jamais culpabilisant ».
- **Réutilisation :** règles de contenu générées pour la documentation et les assistants de développement.
- **Vérification :** générer AI Instructions et vérifier la section liée à la voix ou au contenu.

## 9.4 Direction visuelle et densité

### Direction visuelle

- **Utilité :** résume l’intention esthétique qui doit guider les choix de couleurs, typographie, espacements et composants.
- **À sélectionner :** minimal, premium, editorial, technical, playful, bold, neutral ou custom selon le caractère recherché.
- **Réutilisation :** métadonnées Brand, documentation et instructions IA.
- **Vérification :** enregistrer puis rechercher la direction dans les sorties générées qui présentent le profil de marque.

### Densité de l’interface

- **Utilité :** indique la quantité d’information et d’espace souhaitée dans les interfaces du produit.
- **À sélectionner :** **Compact** pour maximiser l’information visible, **Cozy** pour un équilibre standard ou **Comfortable** pour privilégier l’aération et des zones plus généreuses.
- **Réutilisation :** directive de conception transmise aux consommateurs du design system.
- **Vérification :** générer AI Instructions et contrôler que la densité choisie est documentée.

Ces informations sont des directives structurées. Elles n’appliquent pas automatiquement une nouvelle feuille de style à VulcanForge UI.

## 9.5 Mots-clés d’inspiration

- **Utilité :** complète la direction visuelle avec des références plus concrètes ou nuancées.
- **À saisir :** des mots ou expressions courtes décrivant une ambiance, un matériau, une qualité ou une référence, par exemple « industriel », « chaleureux », « éditorial » ou « précis ».
- **À éviter :** les longues phrases, les synonymes répétés et les termes contradictoires sans explication.
- **Réutilisation :** contexte Brand destiné à la documentation, aux instructions IA et aux équipes qui interprètent le design system.
- **Vérification :** enregistrer puis rechercher les mots-clés dans les sorties générées liées à la marque.

Le profil accepte au maximum 12 mots-clés, chacun limité à 40 caractères.

## 9.6 Terminologie

Une entrée de terminologie définit le vocabulaire officiel à employer pour un même concept.

### Terme préféré

- **Utilité :** établit le mot de référence que les interfaces, la documentation et les équipes doivent utiliser de manière cohérente.
- **À saisir :** un terme précis dans la langue active, par exemple « panier ».
- **Réutilisation :** documentation Brand et instructions de contenu destinées aux assistants IA.
- **Vérification :** enregistrer puis générer AI Instructions dans la langue concernée.

### Termes à éviter

- **Utilité :** signale les synonymes ambigus, anciens ou contraires au positionnement du produit.
- **À saisir :** zéro ou plusieurs alternatives séparées selon le contrôle, par exemple « caddie, corbeille ».
- **Réutilisation :** consignes de terminologie dans les sorties générées.
- **Vérification :** rechercher le terme préféré et les termes interdits dans AI Instructions.

```text
Terme préféré : panier
Termes à éviter : caddie, corbeille
```

Le profil accepte au maximum 20 entrées de terminologie et 12 termes à éviter par entrée. Une entrée structurée vide ou incomplète peut empêcher l’enregistrement : complétez-la ou supprimez-la.

## 9.7 Règles éditoriales

- **Utilité :** transforme le ton de voix en consignes concrètes que les rédacteurs, designers, développeurs et assistants IA peuvent appliquer.
- **À saisir :** une règle autonome et vérifiable par ligne. Préférez « Utiliser un verbe d’action dans chaque bouton principal » à une formulation vague telle que « Être clair ».
- **Réutilisation :** Documentation et AI Instructions, notamment dans les recommandations de contenu.
- **Vérification :** enregistrer puis contrôler que les règles apparaissent dans les sorties générées de la langue sélectionnée.

Exemples :

```text
Utiliser des verbes d’action dans les boutons.
Éviter les formulations culpabilisantes.
Employer le vouvoiement dans les parcours transactionnels.
```

Le profil accepte au maximum 20 règles éditoriales.

## 9.8 Traductions manquantes et fallback

Une traduction manquante est signalée. Elle ne bloque pas forcément l’enregistrement si une valeur valide existe dans la langue de fallback.

Les générateurs indiquent les usages de fallback afin que le contenu incomplet reste visible.

## 9.9 Enregistrer Brand

Après modification :

1. vérifiez l’indicateur « Unsaved » ;
2. activez Save ;
3. attendez l’état « Saved » ;
4. rechargez la page pour vérifier la persistance si le scénario le demande.

Une modification de Brand peut :

- apparaître dans l’activité récente d’Overview ;
- rendre obsolètes les exports précédents ;
- modifier Documentation et AI Instructions.

Brand ne contient pas de panneau de prévisualisation local. Les sorties générées se vérifient dans Documentation et AI Instructions.

---

## 10. Tokens — Créer les valeurs fondamentales

L’espace Tokens organise les décisions de design en cinq familles :

| Famille    | Usage                              | Exemples                             |
| ---------- | ---------------------------------- | ------------------------------------ |
| Color      | Couleurs primitives et sémantiques | fond, contenu, accent                |
| Spacing    | Espacements                        | marges, paddings, gaps               |
| Radius     | Arrondis                           | contrôles, cartes, dialogues         |
| Typography | Styles typographiques              | famille, taille, graisse, interligne |
| Motion     | Durées et mouvements               | transition rapide, durée standard    |

## 10.1 Organisation de l’écran

L’écran comprend généralement :

- un champ de recherche ;
- une action **New token / Nouveau token** ;
- les onglets des familles avec leur nombre de tokens ;
- la liste des tokens de la famille active ;
- un aperçu de la valeur sélectionnée ;
- un inspecteur permettant de modifier la valeur, le chemin et les descriptions.

La famille active, le token sélectionné et la recherche peuvent être reflétés dans l’URL. Cela permet de conserver un contexte lors de certaines navigations ou lors du changement de projet.

## 10.2 Rechercher un token

Utilisez la recherche pour filtrer la famille active. La recherche peut s’appuyer sur les chemins et les informations visibles du token.

Effacer la recherche restaure la liste complète.

### Comprendre les champs communs des tokens

**Famille de token**

- **Utilité :** classe la décision selon sa nature : couleur, espacement, rayon, typographie ou mouvement.
- **À choisir :** la famille correspondant à la valeur réelle. Un rayon ne doit pas être enregistré dans Spacing uniquement parce que sa valeur utilise la même unité.
- **Réutilisation :** filtrage de l’éditeur, validation, Themes, Components et exports.
- **Vérification :** contrôler l’onglet, le type affiché dans l’inspecteur et les formats exportés.

**Kind Primitive / Semantic pour les couleurs**

- **Utilité :** distingue une valeur brute réutilisable d’une décision nommée selon son rôle.
- **À choisir :** Primitive pour une nuance source telle que `indigo.600`; Semantic pour un usage tel que `action.background` qui référence une primitive.
- **Réutilisation :** résolution des couleurs dans Themes, Components et exports.
- **Vérification :** modifier une primitive puis contrôler que le token sémantique associé résout la nouvelle valeur.

**Path / Chemin**

- **Utilité :** constitue l’identifiant technique stable du token.
- **À saisir :** un chemin descriptif et unique composé de lettres, chiffres, points, tirets ou underscores, par exemple `spacing.control.paddingX.md`.
- **Réutilisation :** références de thème, bindings de composants, documentation, instructions IA et code exporté.
- **Vérification :** créer le token, le sélectionner dans Themes ou Components, puis rechercher son chemin dans un export.

**Value / Valeur**

- **Utilité :** contient la décision de design réellement résolue par les consommateurs.
- **À saisir :** une valeur adaptée à la famille, par exemple `#4F46E5`, `1rem`, `0.5rem` ou `150ms`.
- **Réutilisation :** aperçus, calculs de contraste, composants et exports.
- **Vérification :** modifier la valeur et contrôler l’aperçu, la valeur résolue et le fichier exporté.

**Reference / Référence**

- **Utilité :** relie un token sémantique couleur à une primitive afin de centraliser la valeur brute.
- **À choisir :** le token primitif qui représente la valeur actuelle du rôle sémantique.
- **Réutilisation :** résolution des thèmes, contrastes, composants et exports.
- **Vérification :** changer la référence ou la valeur primitive et contrôler le swatch résolu.

**Descriptions française et anglaise**

- **Utilité :** expliquent l’intention du token et les contextes dans lesquels il doit être utilisé.
- **À saisir :** une justification métier ou une règle d’usage, pas une répétition de la valeur. Exemple : « Espacement horizontal standard des contrôles moyens ».
- **Réutilisation :** Documentation, AI Instructions et diagnostics Accessibility.
- **Vérification :** générer Documentation dans chaque langue et examiner les problèmes de description manquante dans Accessibility.

## 10.3 Créer un token couleur primitif

1. ouvrez l’onglet Color ;
2. activez **New token** ;
3. sélectionnez **Primitive** ;
4. saisissez un chemin, par exemple `color.primitive.indigo.600` ;
5. saisissez ou choisissez une valeur HEX valide, par exemple `#4F46E5` ;
6. ajoutez des descriptions française et anglaise ;
7. validez la création.

Les formats HEX pris en charge utilisent les formes courantes à 3, 6 ou 8 caractères hexadécimaux précédées de `#`.

## 10.4 Créer un token couleur sémantique

Un token sémantique doit référencer un token primitif couleur existant.

1. ouvrez **New token** dans Color ;
2. sélectionnez **Semantic** ;
3. saisissez un chemin, par exemple `color.semantic.action.background` ;
4. choisissez un token primitif dans la liste ;
5. vérifiez le swatch et la valeur résolue ;
6. ajoutez les descriptions ;
7. validez.

Si aucun token primitif valide n’existe, la création sémantique ne peut pas être correctement résolue. Créez ou réparez d’abord un token primitif.

## 10.5 Créer un token Spacing, Radius ou Motion

1. ouvrez la famille concernée ;
2. activez **New token** ;
3. saisissez un chemin unique ;
4. saisissez une valeur conforme à l’usage, par exemple `1rem`, `0.5rem`, `150ms` ;
5. ajoutez les descriptions ;
6. validez.

L’interface et le serveur valident le chemin, la présence de la valeur et l’unicité du token.

## 10.6 Créer un token Typography

Le formulaire Typography structure plusieurs décisions qui forment ensemble un style de texte.

**Font family / Famille de police**

- **Utilité :** désigne la famille typographique à utiliser.
- **À saisir :** le nom tel qu’il sera compris par les consommateurs, par exemple `Inter Tight`.
- **Vérification :** examiner l’aperçu et le contenu exporté.

**Font size / Taille**

- **Utilité :** définit la taille visuelle du texte.
- **À saisir :** une valeur avec unité adaptée, par exemple `1rem`.
- **Vérification :** comparer l’aperçu du token et l’export.

**Font weight / Graisse**

- **Utilité :** détermine le niveau d’emphase typographique.
- **À saisir :** une valeur prise en charge par la police, par exemple `400`, `600` ou `700`.
- **Vérification :** contrôler la graisse dans l’aperçu et la valeur sérialisée.

**Line height / Hauteur de ligne**

- **Utilité :** règle l’espace vertical entre les lignes et influence directement la lisibilité.
- **À saisir :** une valeur cohérente avec la taille, par exemple `1.5`.
- **Vérification :** observer un texte sur plusieurs lignes dans l’aperçu lorsqu’il est disponible.

**Letter spacing / Espacement des lettres**

- **Utilité :** ajuste l’espace horizontal entre les caractères.
- **À saisir :** une valeur mesurée et intentionnelle, par exemple `0em` ou une légère valeur négative pour un titre.
- **Vérification :** examiner l’aperçu et l’export ; évitez les valeurs extrêmes qui réduisent la lisibilité.

Exemple :

```text
Chemin : typography.body.md
Famille : Inter Tight
Taille : 1rem
Graisse : 400
Hauteur de ligne : 1.5
Espacement des lettres : 0em
```

Ajoutez les descriptions française et anglaise avant de créer le token.

## 10.7 Modifier un token

Sélectionnez un token dans la liste, puis utilisez l’inspecteur pour :

- modifier sa valeur ;
- changer une référence couleur sémantique ;
- renommer son chemin ;
- compléter ses descriptions française et anglaise.

Après un renommage, vérifiez les espaces qui utilisent ce chemin, notamment Themes et Components.

## 10.8 Descriptions localisées

Les descriptions servent à la documentation, aux diagnostics et aux instructions IA. Un token prêt sans description dans toutes les langues prises en charge peut être signalé par Accessibility.

## 10.9 Données invalides

Une ligne invalide peut provenir d’une donnée persistée ne respectant plus le schéma attendu. Elle doit rester identifiable afin d’être corrigée, et ne doit pas être comptée comme un token valide dans Overview.

---

## 11. Themes — Associer les tokens aux rôles d’interface

Themes permet d’associer les tokens couleur existants aux rôles des modes clair et sombre.

## 11.1 Prérequis

Le projet doit contenir au moins un token couleur qui se résout vers une valeur HEX valide.

Si aucun token utilisable n’est disponible, les mappings ne peuvent pas être édités correctement. Retournez dans Tokens pour créer ou corriger des couleurs.

## 11.2 Choisir le mode

**Light / Dark** détermine le thème que vous êtes en train de consulter et de modifier.

- **Utilité :** permet de définir des références différentes pour un même rôle selon le contexte clair ou sombre.
- **À choisir :** le mode dont vous souhaitez éditer les mappings. Une modification du mode clair ne doit pas être supposée identique dans le mode sombre.
- **Réutilisation :** aperçu du thème, matrice de contraste et exports de thème.
- **Vérification :** enregistrer une référence différente dans chaque mode puis basculer entre Light et Dark.

Le contrôle fonctionne comme une sélection exclusive et prend en charge les flèches du clavier.

## 11.3 Comprendre et modifier un mapping

**Rôle de thème**

- **Utilité :** indique la fonction de la couleur dans l’interface, par exemple une surface, un contenu, une bordure ou un accent.
- **À comprendre :** le rôle est défini par le modèle du thème ; vous choisissez le token qui doit le remplir, pas un nouveau nom de rôle.
- **Réutilisation :** aperçu, contrastes, documentation et exports.
- **Vérification :** sélectionner un rôle et observer les éléments d’aperçu concernés.

**Token reference / Référence de token**

- **Utilité :** relie le rôle à une couleur existante plutôt que de dupliquer une valeur HEX.
- **À choisir :** de préférence un token sémantique qui exprime la même intention que le rôle. Une primitive reste techniquement sélectionnable lorsque l’interface la propose, mais elle porte moins de sens métier.
- **Réutilisation :** valeur résolue, matrice de contraste et exports.
- **Vérification :** contrôler le chemin, le swatch et la valeur HEX affichés dans le sélecteur et l’aperçu.

**Resolved value / Valeur résolue**

- **Utilité :** montre la couleur réellement obtenue après résolution de la référence.
- **À saisir :** rien ; cette information est calculée.
- **Vérification :** modifier la primitive source puis revenir dans Themes pour contrôler la nouvelle valeur.

**Save / Enregistrer**

- **Utilité :** persiste le mapping de la ligne concernée.
- **Vérification :** attendre l’état enregistré puis recharger la page.

Pour chaque rôle :

1. ouvrez le sélecteur de token ;
2. examinez le chemin, la valeur HEX et le swatch ;
3. choisissez un token couleur ;
4. vérifiez la valeur résolue ;
5. activez Save pour le mapping concerné ;
6. rechargez la page pour vérifier la persistance si nécessaire.

Une option de liste peut être choisie :

- à la souris ;
- avec les flèches ;
- avec Home ou End ;
- avec la saisie incrémentale ;
- avec Entrée ou Espace.

Échap ferme la liste et restaure le focus.

## 11.4 Aperçu

L’aperçu montre l’effet des mappings sur des éléments d’interface représentatifs. Il doit évoluer lorsque vous changez de mode ou de référence.

L’aperçu sert à examiner la cohérence visuelle, mais ne remplace pas une validation dans un produit réel.

## 11.5 Matrice de contraste

La matrice présente les résultats des combinaisons de premier plan et d’arrière-plan configurées.

Les niveaux possibles incluent :

- AAA ;
- AA ;
- texte large uniquement ;
- échec.

Corrigez un échec en modifiant le mapping du rôle concerné ou les tokens sources.

---

## 12. Components — Décrire les contrats de composants

Components contient un registre de contrats structurés. Les types actuellement pris en charge sont :

- Button ;
- Text field ;
- Card ;
- Alert ;
- Dialog.

Un type déjà présent dans le registre peut ne plus être proposé à la création afin d’éviter les doublons.

## 12.1 Registre

Le registre permet de :

- parcourir les composants ;
- rechercher ou filtrer les entrées ;
- identifier leur statut ;
- sélectionner un composant ;
- créer un contrat disponible ;
- ouvrir son éditeur détaillé ;
- supprimer un contrat lorsque l’action est disponible.

## 12.2 Créer un composant

1. activez **New component / Nouveau composant** ;
2. choisissez un type disponible ;
3. confirmez ;
4. l’application ouvre le contrat nouvellement créé.

Le nouveau contrat est généralement un brouillon à compléter.

## 12.3 Métadonnées

### Nom du composant

- **Utilité :** fournit le nom canonique affiché dans le registre, la documentation et les sorties générées.
- **À saisir :** un nom court correspondant au concept du composant, par exemple `Button` ou `Text field`, sans inclure une variante particulière.
- **Réutilisation :** registre, Overview, Accessibility, Documentation et AI Instructions.
- **Vérification :** enregistrer puis contrôler le registre et la documentation générée.

### Statut

- **Draft :** contrat encore en cours de rédaction ou de validation.
- **Ready :** contrat suffisamment complet et relu pour être proposé aux consommateurs.
- **Deprecated :** contrat conservé pour compatibilité mais à ne plus adopter dans de nouvelles interfaces.

Le statut influence la manière dont le composant est présenté dans les synthèses et certaines sorties. Utilisez Ready uniquement après avoir revu le contenu localisé, l’anatomie, les variantes, les états, l’accessibilité et les bindings.

## 12.4 Contenu localisé

Le sélecteur FR/EN de cette section choisit la langue métier que vous éditez. Il ne change pas la langue générale de l’application.

### Purpose / Finalité

- **Utilité :** explique pourquoi le composant existe et quel problème d’interface il résout.
- **À saisir :** une description centrée sur l’intention, par exemple « Déclenche une action explicite à la suite d’une décision de l’utilisateur ».
- **Réutilisation :** documentation du composant et instructions IA.
- **Vérification :** générer Documentation dans la langue concernée.

### Usage guidelines / Recommandations d’usage

- **Utilité :** précise quand utiliser le composant, comment choisir ses variantes et dans quelles situations préférer une autre solution.
- **À saisir :** des règles décisionnelles concrètes, pas une description de son apparence.
- **Réutilisation :** Documentation et AI Instructions.
- **Vérification :** contrôler les recommandations générées pour le composant.

### Content guidelines / Recommandations de contenu

- **Utilité :** encadre les textes placés dans le composant : libellés, messages, titres ou actions.
- **À saisir :** des règles rédactionnelles spécifiques au composant, par exemple « Commencer le libellé par un verbe d’action ».
- **Réutilisation :** Documentation et consignes fournies aux assistants IA.
- **Vérification :** générer AI Instructions et rechercher le composant.

## 12.5 Anatomie

L’anatomie décrit les parties internes du composant.

Chaque partie comprend les champs suivants.

**Key / Clé technique**

- **Utilité :** identifie la partie de façon stable dans le contrat et les sorties destinées aux développeurs.
- **À saisir :** une clé courte et technique, par exemple `root`, `label` ou `leadingIcon`.
- **Vérification :** examiner l’aperçu du contrat IA ou la documentation générée.

**Label / Libellé localisé**

- **Utilité :** donne un nom compréhensible aux lecteurs de la langue active.
- **À saisir :** le nom métier de la partie, sans recopier nécessairement la casse technique de la clé.
- **Vérification :** basculer entre FR et EN puis générer Documentation dans chaque langue.

**Requirement / Niveau d’exigence**

- **Required :** la partie doit être présente dans toute implémentation conforme.
- **Optional :** la partie peut être ajoutée selon le contexte.
- **Derived :** la partie apparaît ou se déduit d’un état ou d’une configuration, par exemple un spinner pendant le chargement.

Ce choix aide les consommateurs à distinguer la structure minimale des éléments conditionnels.

Exemple pour un bouton :

```text
root — requis
label — requis
leadingIcon — facultatif
spinner — dérivé
```

## 12.6 Variantes, tailles et états

Chaque collection contient une clé technique et, lorsque **Edit details / Modifier les détails** est développé, un libellé et une description localisés.

**Key / Clé**

- **Utilité :** valeur stable utilisée dans le contrat et les sorties techniques.
- **À saisir :** un identifiant concis tel que `primary`, `sm` ou `focusVisible`.

**Label / Libellé**

- **Utilité :** nom lisible présenté dans la documentation de la langue active.
- **À saisir :** une traduction destinée aux humains, par exemple « Principal » ou « Petit ».

**Description**

- **Utilité :** explique la différence avec les autres options et la situation dans laquelle elle doit être choisie.
- **À saisir :** une règle de décision. Exemple pour `danger` : « Réservé aux actions destructives ou irréversibles ».

Les **variantes** représentent des intentions ou apparences alternatives, les **tailles** des niveaux de dimension cohérents et les **états** les conditions d’interaction ou du système.

Exemples :

- variantes : `primary`, `secondary`, `danger` ;
- tailles : `sm`, `md`, `lg` ;
- états : `default`, `hover`, `focusVisible`, `disabled`, `loading`.

Pour un composant interactif, documentez explicitement l’état `focusVisible`. Son absence peut être signalée dans Accessibility.

## 12.7 Règles d’accessibilité

Ajoutez des règles avec les champs suivants.

**Key / Clé**

- **Utilité :** identifie la règle de manière stable dans le contrat et les diagnostics.
- **À saisir :** un nom technique décrivant l’exigence, par exemple `keyboardActivation`, `focusVisible` ou `accessibleName`.

**Severity / Sévérité**

- **Info :** recommandation ou information utile sans non-conformité immédiate.
- **Warning :** problème susceptible de dégrader l’expérience et devant être corrigé avant que le contrat soit considéré comme abouti.
- **Critical :** exigence indispensable dont l’absence peut rendre le composant inutilisable ou inaccessible.

La sévérité doit refléter l’impact utilisateur, pas l’effort de correction.

**Description localisée**

- **Utilité :** énonce le comportement attendu de manière testable.
- **À saisir :** une consigne précise, par exemple « Le bouton doit être activable avec Entrée et Espace lorsqu’il possède le focus ».
- **Réutilisation :** Documentation, AI Instructions et contrôles Accessibility.
- **Vérification :** générer les sorties puis examiner le centre Accessibility.

Exemples :

```text
keyboardActivation — critical
focusVisible — critical
accessibleName — warning
```

Un composant interactif sans règle d’accessibilité peut être signalé.

## 12.8 Usages interdits

Les forbidden patterns décrivent ce qu’il ne faut pas faire avec le composant.

- **Utilité :** transforme les erreurs de conception récurrentes en règles explicites et réutilisables.
- **À saisir :** une situation interdite et sa limite, dans la langue active. La phrase doit permettre à un lecteur de décider clairement si un usage est acceptable.
- **Réutilisation :** Documentation et AI Instructions.
- **Vérification :** générer AI Instructions avec la section des patterns interdits activée.

Exemple :

```text
Ne pas utiliser un bouton désactivé comme seul moyen d’expliquer une erreur.
Ne pas employer un bouton danger pour une action réversible et anodine.
```

## 12.9 Visual Tokens

Les bindings visuels associent le composant à des tokens existants.

### Comprendre les champs d’un binding

**Role / Rôle de preview**

- **Utilité :** indique quelle propriété visuelle du composant reçoit le token et permet à la matrice intégrée de rendre les rôles officiellement pris en charge.
- **À choisir :** un rôle officiel disponible, ou Custom role lorsque le contrat doit exposer une propriété non couverte.
- **Vérification :** observer la matrice et les fondations visuelles après sélection du token.

**Custom role key / Clé personnalisée**

- **Utilité :** nomme une propriété spécifique destinée aux consommateurs externes du contrat.
- **À saisir :** une clé stable, explicite et non déjà utilisée. Un rôle personnalisé n’est pas garanti d’avoir un effet dans la matrice intégrée.
- **Vérification :** enregistrer, recharger puis contrôler l’aperçu du contrat destiné aux consommateurs IA.

**Token type / Type de token**

- **Utilité :** garantit que la liaison utilise une famille compatible.
- **À choisir :** pour un rôle officiel, le type est imposé et reste visible mais verrouillé ; pour un rôle personnalisé, choisissez la famille réellement attendue.
- **Vérification :** contrôler que la liste Token path ne propose que les tokens compatibles.

**Token path / Chemin du token**

- **Utilité :** relie le composant à une décision de design existante sans recopier sa valeur.
- **À choisir :** un token dont l’intention correspond au rôle, idéalement sémantique lorsqu’un tel token existe.
- **Réutilisation :** matrice visuelle, fondations, Accessibility, Documentation, AI Instructions et exports du contrat.
- **Vérification :** enregistrer, recharger et contrôler la valeur résolue dans les aperçus.

**Description localisée**

- **Utilité :** précise l’intention de la liaison lorsqu’elle n’est pas évidente à partir du rôle et du chemin.
- **À saisir :** une courte règle d’usage dans la langue active, particulièrement utile pour les rôles personnalisés.
- **Vérification :** examiner la documentation ou l’aperçu de contrat généré.

### Rôles officiels

| Rôle de preview | Type de token imposé |
| --------------- | -------------------- |
| background      | color                |
| foreground      | color                |
| border          | color                |
| radius          | radius               |
| padding         | spacing              |
| paddingX        | spacing              |
| paddingY        | spacing              |
| duration        | motion               |
| motion          | motion               |

Pour un rôle officiel :

- le type est attribué automatiquement ;
- le champ de type reste visible mais verrouillé lorsqu’il est compatible ;
- les tokens proposés sont filtrés par type ;
- un changement de rôle peut effacer un chemin devenu incompatible ;
- le même rôle officiel ne peut pas être utilisé deux fois dans un contrat.

### Custom role / Rôle personnalisé

Le mode avancé permet de saisir une clé arbitraire et de choisir librement un type de token.

Un rôle personnalisé est conservé dans le contrat et peut être utilisé par un consommateur externe. La matrice visuelle intégrée ne rend cependant que les rôles officiellement pris en charge et certains alias reconnus.

Par conséquent, un binding personnalisé de typographie peut être valide et enregistré sans modifier visuellement la matrice actuelle.

## 12.10 Aperçus du composant

Selon le type de composant, l’espace peut afficher :

- une matrice de variantes, tailles et états ;
- les fondations visuelles résolues ;
- une représentation du contrat destiné aux consommateurs IA.

Les aperçus sont des représentations déterministes du contrat, pas une implémentation complète du composant dans un framework.

## 12.11 Enregistrement et validation

Après modification :

1. vérifiez l’état Unsaved ;
2. corrigez les erreurs si l’état devient Invalid ;
3. activez Save ;
4. attendez Saved ;
5. rechargez et vérifiez les données.

## 12.12 Supprimer un composant

La suppression d’un contrat est destructive. Ne l’utilisez que sur un composant créé pour le scénario de test.

Vérifiez après suppression :

- la disparition de l’entrée du registre ;
- l’absence d’ancienne sélection dans l’URL ;
- la mise à jour d’Overview et Accessibility.

---

## 13. Accessibility — Examiner les signaux automatisés

Accessibility analyse les données actuelles du projet. Il ne réalise pas un audit humain complet.

## 13.1 Sources analysées

Les contrôles peuvent concerner :

- les contrastes des thèmes ;
- la résolution des tokens ;
- la validité des jeux de tokens ;
- la documentation des tokens ;
- la validité des contrats de composants ;
- les traductions de composants ;
- les règles d’accessibilité des composants ;
- la présence de l’état focus-visible ;
- les bindings de tokens des composants.

## 13.2 Score

Le score indicatif part de 100 et applique des pénalités fixes :

```text
100 − (problèmes critiques × 25) − (avertissements × 10)
```

La valeur affichée ne descend pas sous 0.

Ce score sert à prioriser les corrections. Ce n’est pas un pourcentage de conformité WCAG.

## 13.3 Liste des problèmes

Chaque problème indique notamment :

- la sévérité ;
- le périmètre ;
- la règle détectée ;
- l’élément concerné.

Sélectionnez une ligne pour afficher le détail et la recommandation.

Sur grand écran, le détail apparaît dans un rail latéral. Sur un écran plus étroit, il apparaît sous la liste.

## 13.4 Corriger un problème

Le détail propose un lien vers l’espace source :

- Tokens ;
- Themes ;
- Components.

Effectuez la correction, enregistrez-la, puis revenez à Accessibility pour vérifier que le signal a disparu ou évolué.

## 13.5 Contrastes

Pour un problème de contraste, examinez :

- le token de premier plan ;
- le token d’arrière-plan ;
- leurs valeurs résolues ;
- le ratio ;
- le niveau atteint.

La correction se fait généralement dans Themes ou Tokens.

## 13.6 Enregistrer un rapport

L’action d’enregistrement crée un instantané du rapport courant. Cet instantané peut apparaître dans l’activité récente d’Overview.

Le score courant d’Overview reste toutefois calculé à partir des données actuelles du projet, et non à partir d’un ancien rapport enregistré.

---

## 14. Documentation — Générer la documentation Markdown

Documentation transforme les données structurées du projet en document Markdown.

## 14.1 Choisir la langue de sortie

- **Utilité :** détermine la langue principale du fichier Markdown généré.
- **À choisir :** une langue prise en charge par le projet. Ce choix ne traduit pas automatiquement une donnée absente ; le fallback est utilisé et signalé lorsque nécessaire.
- **Réutilisation :** nom de fichier, contenus localisés et profil de génération enregistré.
- **Vérification :** générer successivement les deux langues et comparer les contenus et diagnostics.

Si le projet ne prend en charge qu’une langue, le contrôle devient informatif.

L’application affiche le nombre de traductions manquantes utilisées avec fallback.

## 14.2 Choisir les sections

Les sections disponibles sont :

- Overview ;
- Tokens ;
- Themes ;
- Components ;
- Accessibility.

Chaque interrupteur détermine si les données de l’espace correspondant apparaissent dans le fichier : Overview pour la synthèse, Tokens pour les valeurs, Themes pour les mappings, Components pour les contrats et Accessibility pour les signaux disponibles.

- **Utilité :** adapter le document à son destinataire plutôt que de produire systématiquement un fichier exhaustif.
- **À choisir :** uniquement les sections nécessaires au cas d’usage. Par exemple, un développeur intégrant les fondations peut avoir besoin de Tokens et Themes, tandis qu’une revue produit peut nécessiter Overview et Components.
- **Réutilisation :** aperçu courant et préférences enregistrées du projet.
- **Vérification :** désactiver une section, générer l’aperçu et vérifier sa disparition dans les modes Rendu et Source.

Au moins une section doit être sélectionnée pour générer une prévisualisation utile.

## 14.3 Format

Le format de cette page est Markdown.

## 14.4 Générer et prévisualiser

Activez **Generate / Générer** pour revenir à l’aperçu rendu et replacer le début du document en haut.

Deux modes d’aperçu sont disponibles :

- **Rendered / Rendu** : présentation visuelle du Markdown ;
- **Source** : contenu Markdown brut.

L’en-tête de l’aperçu indique le nom du fichier, le nombre de caractères et le nombre de sections.

## 14.5 Copier et télécharger

- **Copy / Copier** place le Markdown dans le presse-papiers ;
- **Download / Télécharger** crée un fichier `.md`.

Vérifiez le message de succès ou d’erreur après une copie.

## 14.6 Enregistrer les préférences

La langue et la sélection de sections constituent un profil de génération. Si elles sont modifiées, l’interface affiche un état non enregistré.

Utilisez Save pour les conserver comme préférences du projet.

## 14.7 Diagnostics

Les diagnostics peuvent signaler :

- des données sources invalides ;
- des sections incomplètes ;
- des traductions manquantes ;
- l’usage du fallback.

La génération peut rester disponible tout en affichant ces avertissements.

---

## 15. AI Instructions — Générer des consignes pour une IA

AI Instructions produit un fichier Markdown destiné à guider un assistant de développement ou de génération de code.

La génération est déterministe : elle utilise le modèle structuré du projet. Elle n’appelle pas un service d’IA pour inventer les règles.

## 15.1 Choisir la langue

- **Utilité :** choisit la langue des consignes remises à l’assistant de développement.
- **À choisir :** la langue utilisée par l’équipe ou par le contexte dans lequel le fichier sera consommé.
- **Réutilisation :** contenu, nom de fichier et préférences enregistrées.
- **Vérification :** générer les deux langues et examiner les fallbacks signalés.

Les traductions manquantes et fallbacks sont signalés.

## 15.2 Choisir la sévérité des consignes

Trois niveaux sont disponibles :

- **Balanced** ;
- **Strict** ;
- **Very strict**.

- **Balanced :** formule des règles fermes tout en laissant une marge de décision au consommateur.
- **Strict :** réduit les interprétations possibles et insiste davantage sur les obligations du design system.
- **Very strict :** présente les règles comme des contraintes impératives, adapté à un contexte où les écarts doivent être minimisés.

**Utilité :** adapte le ton normatif du fichier au niveau de contrôle souhaité. Ce réglage ne change pas les données du design system ; il change la manière dont elles sont formulées.

**Vérification :** générer le même profil avec deux niveaux et comparer les formulations dans l’aperçu.

## 15.3 Choisir les sections

Les sections sont :

- règles de tokens ;
- règles de composants ;
- règles d’accessibilité ;
- patterns interdits.

- **Règles de tokens :** conventions de valeurs, chemins et références.
- **Règles de composants :** contrats, variantes, états et bindings.
- **Règles d’accessibilité :** exigences documentées et signaux du projet.
- **Patterns interdits :** usages explicitement proscrits dans les contrats.

**Utilité :** limiter le fichier aux catégories de règles utiles au consommateur ciblé.

**Vérification :** désactiver une catégorie et confirmer sa disparition dans l’aperçu et le fichier téléchargé.

Les informations Brand et la voix du produit sont intégrées lorsque les données existent.

## 15.4 Aperçu

L’aperçu affiche le fichier Markdown généré avec :

- son nom ;
- la langue ;
- le niveau de sévérité ;
- le nombre de sections ;
- le nombre de caractères.

Le panneau de code peut recevoir le focus et être parcouru au clavier.

## 15.5 Copier et télécharger

- Copy place le contenu dans le presse-papiers ;
- Download crée un fichier `.md`.

## 15.6 Enregistrer les préférences

La langue, la sévérité et les sections sélectionnées forment le profil AI Instructions du projet.

Utilisez Save lorsque l’état indique des préférences non enregistrées.

## 15.7 Diagnostics

Les diagnostics permettent d’identifier les données sources qui réduisent la qualité des instructions : traductions manquantes, contrats invalides, bindings non résolus, etc.

---

## 16. Exports — Produire les fichiers d’intégration

Exports centralise six formats :

1. CSS Variables ;
2. Tailwind CSS v4 ;
3. TypeScript Theme ;
4. React Native Theme ;
5. Documentation Markdown ;
6. AI Instructions.

## 16.1 Sélectionner un format

- **Utilité :** choisit la représentation technique ou documentaire produite à partir du même modèle de design system.
- **À choisir :** CSS Variables pour des propriétés CSS consommables directement, Tailwind CSS v4 pour une intégration Tailwind, TypeScript Theme pour un objet typé, React Native Theme pour le mobile, Documentation Markdown pour les lecteurs humains ou AI Instructions pour un assistant de développement.
- **Réutilisation :** aperçu, nom de fichier, téléchargement et historique d’export.
- **Vérification :** sélectionner plusieurs cartes et confirmer que le nom, la syntaxe et les diagnostics changent selon le format.

L’aperçu affiche le contenu correspondant, son nom de fichier et ses informations principales.

## 16.2 Inclure les éléments dépréciés

Le contrôle **Include deprecated / Inclure les éléments dépréciés** détermine si les données marquées Deprecated doivent apparaître dans les formats compatibles.

- **Utilité :** permet de produire soit une sortie limitée aux décisions encore recommandées, soit une sortie de compatibilité contenant également les éléments Deprecated.
- **À choisir :** désactivé pour une nouvelle intégration ; activé uniquement lorsqu’un consommateur doit encore prendre en charge des éléments historiques.
- **Réutilisation :** contenu du format sélectionné et journal d’export correspondant.
- **Vérification :** marquer un élément comme Deprecated lorsqu’un scénario le permet, puis comparer les deux exports.

Cette option ne modifie pas les données du projet : elle modifie uniquement le contenu généré.

## 16.3 Copier et télécharger

Pour le format sélectionné :

- Copy copie le contenu ;
- Download télécharge le fichier.

Une génération ou un téléchargement réussi est journalisé dans l’historique d’export lorsque le format le prévoit.

## 16.4 Diagnostics

Un format peut signaler :

- des tokens ignorés ;
- des problèmes de résolution de thème ;
- des traductions manquantes ;
- d’autres données incompatibles avec la sortie.

Comparez les diagnostics avec Tokens, Themes, Brand, Documentation ou AI Instructions.

## 16.5 Exports obsolètes

Après une modification de Brand, Tokens, Themes ou Components, Overview peut indiquer qu’un export précédemment généré est obsolète.

Régénérez le format puis vérifiez que l’état d’Overview se met à jour.

---

## 17. Paramètres du projet

L’espace Settings situé dans la navigation du projet affiche :

- le nom du projet ;
- son slug ;
- les actions destructives au niveau du projet.

## 17.1 Supprimer un projet

Seul le propriétaire de l’espace de travail peut supprimer définitivement un projet.

La suppression retire notamment :

- Brand ;
- Tokens ;
- Themes ;
- Components ;
- rapports Accessibility ;
- préférences Documentation ;
- préférences AI Instructions ;
- historique Exports.

Le champ de confirmation attend exactement le nom du projet affiché.

- **Utilité :** oblige l’utilisateur à identifier explicitement la ressource qu’il va supprimer et réduit les suppressions accidentelles.
- **À saisir :** le nom complet avec la même casse, les mêmes espaces et les mêmes caractères.
- **Vérification :** saisir d’abord une valeur différente pour confirmer que l’action reste verrouillée, puis utiliser le nom exact uniquement sur un projet jetable.

Après suppression, l’application revient au Dashboard avec une confirmation.

> N’exécutez ce scénario que sur un projet jetable. L’action est irréversible.

---

## 18. Paramètres du compte

Les paramètres du compte sont accessibles depuis le menu utilisateur sur desktop ou le menu burger sur les écrans plus étroits.

## 18.1 Informations personnelles

### Nom affiché

- **Utilité :** identifie l’utilisateur dans l’interface sans modifier son identifiant de connexion.
- **À saisir :** un nom compris entre 2 et 80 caractères.
- **Réutilisation :** menu utilisateur, paramètres et contexte de l’espace personnel.
- **Vérification :** enregistrer puis rouvrir le menu utilisateur. Une modification du nom ne nécessite pas de mot de passe.

### Adresse e-mail

- **Utilité :** constitue l’identifiant utilisé pour les connexions futures.
- **À saisir :** une adresse valide et non utilisée par un autre compte.
- **Réutilisation :** authentification et confirmation de suppression du compte.
- **Vérification :** enregistrer, constater la déconnexion, puis se reconnecter avec la nouvelle adresse.

### Mot de passe actuel

- **Utilité :** confirme l’identité de l’utilisateur lorsqu’il modifie son adresse e-mail.
- **À saisir :** le mot de passe actuel du compte. Il n’est pas nécessaire lorsque seul le nom change.
- **Vérification :** tenter un changement d’e-mail avec une valeur incorrecte, puis avec la valeur correcte.

Une modification réussie de l’e-mail déconnecte le compte et impose de se reconnecter avec la nouvelle adresse.

## 18.2 Langue

- **Utilité :** définit la langue préférée de l’interface pour le compte.
- **À choisir :** français ou anglais selon la langue de navigation souhaitée. Ce réglage ne traduit pas les contenus métier du projet.
- **Réutilisation :** menus, libellés, messages et route localisée après enregistrement.
- **Vérification :** enregistrer et contrôler que la page équivalente s’ouvre dans la langue choisie.

## 18.3 Apparence

- **System :** suit la préférence claire ou sombre du système ou du navigateur.
- **Light :** force l’apparence claire.
- **Dark :** force l’apparence sombre.

**Utilité :** définit l’apparence de VulcanForge UI pour le compte ; ce réglage est indépendant des thèmes Light et Dark du design system édité.

**Vérification :** sélectionner chaque option, observer la prévisualisation immédiate, enregistrer puis recharger la page.

## 18.4 Supprimer le compte

La suppression permanente exige deux champs de confirmation.

**Adresse e-mail de confirmation**

- **Utilité :** confirme explicitement le compte visé.
- **À saisir :** l’adresse e-mail exacte du compte actuel.

**Mot de passe actuel**

- **Utilité :** vérifie que l’utilisateur autorise l’opération sensible.
- **À saisir :** le mot de passe actuel du compte.

Testez d’abord les erreurs de confirmation, puis n’exécutez la suppression complète que sur un compte jetable.

La suppression retire le compte et les données possédées selon les relations de l’espace de travail, puis déconnecte la session.

> Utilisez uniquement un compte jetable. Ne testez jamais cette action avec le compte d’un autre testeur ou avec un environnement contenant des données à conserver.

---

## 19. Jeu de données conseillé pour une première prise en main

Ce jeu de données facultatif aide plusieurs testeurs à comparer leurs résultats.

## 19.1 Projet

```text
Nom : Atlas Commerce DS
Description : Design system bilingue pour une plateforme e-commerce Web et mobile.
Plateformes : Web et Mobile
Langue par défaut : Français
Langues prises en charge : Français et Anglais
Direction visuelle : Technical
Cible d’accessibilité : WCAG AA
```

## 19.2 Brand

### Français

```text
Tagline : Acheter plus simplement.
Description courte : Une expérience e-commerce claire, rapide et accessible.
Personnalité : Fiable, directe et rassurante.
Audience : Acheteurs en ligne et équipes de vente omnicanales.
Ton : Concis, utile et jamais culpabilisant.
```

### Anglais

```text
Tagline: Shopping made simpler.
Short description: A clear, fast and accessible e-commerce experience.
Personality: Reliable, direct and reassuring.
Audience: Online shoppers and omnichannel retail teams.
Tone: Concise, helpful and never guilt-inducing.
```

### Règles

```text
Terme préféré FR : panier
À éviter FR : caddie, corbeille
Preferred EN term: cart
Avoid EN: basket

Règle FR : Utiliser un verbe d’action dans chaque bouton principal.
Rule EN: Use an action verb in every primary button.
```

## 19.3 Tokens couleur

```text
color.primitive.indigo.600 = #4F46E5
color.primitive.slate.900 = #0F172A
color.primitive.white = #FFFFFF
color.semantic.action.background -> color.primitive.indigo.600
color.semantic.content.primary -> color.primitive.slate.900
color.semantic.surface.primary -> color.primitive.white
```

## 19.4 Autres tokens

```text
spacing.2 = 0.5rem
spacing.4 = 1rem
spacing.6 = 1.5rem
radius.control.md = 0.5rem
radius.surface.lg = 0.75rem
motion.duration.fast = 150ms
motion.duration.standard = 250ms
```

### Typography

```text
Chemin : typography.body.md
Famille : Inter Tight
Taille : 1rem
Graisse : 400
Hauteur de ligne : 1.5
Espacement des lettres : 0em
```

## 19.5 Composant Button

```text
Statut initial : Draft
Variantes : primary, secondary, danger
Tailles : sm, md, lg
États : default, hover, focusVisible, disabled, loading
Anatomie : root, label, leadingIcon, trailingIcon, spinner
```

Bindings suggérés :

```text
background -> color.semantic.action.background
foreground -> color.semantic.surface.primary
radius -> radius.control.md
paddingX -> spacing.4
duration -> motion.duration.fast
```

Règles d’accessibilité suggérées :

```text
accessibleName — critical
keyboardActivation — critical
focusVisible — critical
```

---

## 20. Comportements intentionnels à ne pas confondre avec des anomalies

Les comportements suivants sont attendus :

- l’identité de l’espace de travail est statique ;
- Overview est en lecture seule ;
- le score Accessibility est indicatif et non une certification ;
- changer la langue de l’interface ne change pas automatiquement la langue du contenu ;
- le slug du projet reste stable après modification du nom dans Brand ;
- Brand n’a pas de preview local ;
- Documentation et AI Instructions sont générés à partir du modèle, sans appel à un service d’IA ;
- un contenu localisé incomplet peut être enregistré lorsque le fallback est valide ;
- un binding personnalisé de composant peut ne pas modifier la matrice visuelle ;
- le type de token d’un rôle officiel de preview reste visible mais verrouillé ;
- les options déjà utilisées d’un rôle officiel de composant sont indisponibles ;
- la vue mobile peut retirer certains rails de preview plutôt que de les compresser ;
- après un changement d’e-mail réussi, l’utilisateur est déconnecté ;
- la suppression d’un compte ou d’un projet est irréversible.

---

## 21. Signaler une anomalie

Une remontée exploitable doit permettre à une autre personne de reproduire le problème sans information supplémentaire.

## 21.1 Titre

Utilisez une formulation concise :

```text
[Components][FR][Desktop] Le statut Saved ne s’affiche pas après la modification d’un binding
```

## 21.2 Informations minimales

Indiquez :

- URL ou route ;
- environnement ;
- navigateur et version ;
- système d’exploitation ;
- largeur ou appareil ;
- langue de l’interface ;
- langue du contenu si différente ;
- apparence System, Light ou Dark ;
- compte et projet de test, sans mot de passe ;
- état des données avant le test.

## 21.3 Étapes de reproduction

Numérotez les actions précisément.

Exemple :

```text
1. Ouvrir le projet Atlas Commerce DS.
2. Ouvrir Components.
3. Sélectionner Button.
4. Ajouter un binding Visual Tokens.
5. Choisir le rôle radius.
6. Choisir radius.control.md.
7. Cliquer sur Save.
```

## 21.4 Résultat attendu

Décrivez ce que l’application devrait faire.

```text
Le contrat est enregistré, le statut passe par Saving puis Saved et la valeur persiste après rechargement.
```

## 21.5 Résultat observé

Décrivez uniquement les faits visibles.

```text
Le bouton Save devient inactif, mais le statut reste Unsaved. Après rechargement, le binding a disparu.
```

## 21.6 Pièces jointes

Ajoutez si possible :

- capture d’écran complète ;
- courte vidéo ;
- message d’erreur exact ;
- erreurs de console pertinentes ;
- fichier téléchargé présentant le défaut.

Ne capturez jamais un mot de passe ou une donnée confidentielle.

## 21.7 Sévérité suggérée

| Niveau     | Définition                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------- |
| Bloquant   | Impossible de poursuivre le parcours principal, aucune solution de contournement             |
| Critique   | Perte de données, faille de sécurité, suppression inattendue ou résultat gravement incorrect |
| Majeur     | Fonction importante incorrecte avec contournement difficile                                  |
| Mineur     | Défaut limité avec contournement simple                                                      |
| Cosmétique | Problème visuel ou de texte sans impact fonctionnel significatif                             |

---

## 22. Checklist de fin de prise en main

Avant de considérer qu’un testeur a parcouru l’application, vérifier qu’il a pu :

- créer un compte ou se connecter ;
- changer la langue de l’interface ;
- créer un projet via les cinq étapes ;
- comprendre Overview et ouvrir une action recommandée ;
- compléter Brand en français et en anglais ;
- créer un token couleur primitif et un token sémantique ;
- créer au moins un token d’une autre famille ;
- configurer un mapping de thème et examiner un contraste ;
- créer ou modifier un contrat de composant ;
- ajouter une règle d’accessibilité et un binding de token ;
- examiner un problème dans Accessibility ;
- enregistrer un rapport ;
- générer, copier et télécharger Documentation ;
- générer, copier et télécharger AI Instructions ;
- copier et télécharger au moins un format dans Exports ;
- modifier et enregistrer une préférence de compte ;
- changer de projet en conservant le contexte ;
- utiliser les interactions essentielles au clavier ;
- vérifier une page en français, en anglais, en thème clair, en thème sombre et à largeur mobile.

Les suppressions de composant, projet et compte doivent être exécutées uniquement lorsqu’elles font partie d’un scénario de recette explicite avec des données jetables.
