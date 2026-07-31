# VulcanForge UI — Guide d’utilisation pour les testeurs

**Version du guide :** 1.0  
**Date :** 31 juillet 2026  
**Périmètre :** application VulcanForge UI avant le parcours final DS-170-08  
**Public :** testeurs fonctionnels, testeurs UX, parties prenantes et utilisateurs découvrant les design systems

> Ce document explique comment prendre en main l’application et utiliser chaque espace fonctionnel. Il ne remplace pas le protocole de recette : les anomalies doivent être consignées séparément avec leurs étapes de reproduction.

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

Renseignez :

- **Nom** : entre 2 et 80 caractères ;
- **E-mail** : adresse valide et non utilisée par un autre compte ;
- **Mot de passe** : entre 12 et 72 caractères ;
- **Confirmation du mot de passe** : doit être identique au mot de passe.

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

Renseignez :

- **Nom du projet** : entre 2 et 80 caractères ;
- **Description** : facultative, 240 caractères maximum.

Le nom est l’identité initiale du projet. Un slug technique est généré lors de la création.

## 7.2 Étape 2 — Plateformes et langues

### Plateformes

Sélectionnez au moins une plateforme :

- Web ;
- Mobile.

Les deux peuvent être sélectionnées.

### Langues prises en charge

Le projet peut prendre en charge :

- français ;
- anglais.

Sélectionnez au moins une langue. La langue par défaut doit obligatoirement faire partie des langues prises en charge.

La langue par défaut est utilisée comme fallback pour les contenus localisés incomplets.

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

Ce choix initialise la direction du profil Brand. Il peut ensuite être modifié dans Brand.

## 7.4 Étape 4 — Cible d’accessibilité

Choisissez :

- **WCAG AA** ;
- **WCAG AAA**.

Cette sélection exprime l’objectif du projet. Elle ne constitue pas une certification automatique.

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

## 9.3 Champs localisés

Pour chaque langue, vous pouvez renseigner :

- **Tagline / Signature** ;
- **Short description / Description courte** ;
- **Personality / Personnalité** ;
- **Audience / Public cible** ;
- **Tone of voice / Ton de voix**.

La description courte de la langue par défaut est utilisée pour résumer le projet dans d’autres surfaces, avec fallback si nécessaire.

## 9.4 Direction visuelle et densité

La direction visuelle peut être : minimal, premium, editorial, technical, playful, bold, neutral ou custom.

La densité peut être :

- **Compact** : interface plus dense ;
- **Cozy** : équilibre standard ;
- **Comfortable** : davantage d’espace.

Ces informations sont des directives structurées. Elles n’appliquent pas automatiquement une nouvelle feuille de style à l’application VulcanForge UI.

## 9.5 Mots-clés d’inspiration

Ajoutez des mots-clés représentant l’univers souhaité : par exemple « industriel », « chaleureux », « éditorial », « précis ».

Respectez la limite indiquée par l’interface.

## 9.6 Terminologie

Une entrée de terminologie contient :

- un terme préféré localisé ;
- zéro ou plusieurs termes à éviter.

Lorsque le contrôle attend plusieurs valeurs, saisissez-les sous la forme indiquée par l’interface, notamment avec des valeurs séparées par des virgules.

Exemple :

```text
Terme préféré : panier
Termes à éviter : caddie, corbeille
```

Les valeurs incomplètes ou les entrées structurées vides peuvent empêcher l’enregistrement. Complétez-les ou supprimez-les.

## 9.7 Règles éditoriales

Saisissez les règles de rédaction, une par ligne lorsque le champ le permet.

Exemples :

```text
Utiliser des verbes d’action dans les boutons.
Éviter les formulations culpabilisantes.
Employer le vouvoiement dans les parcours transactionnels.
```

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

Le formulaire Typography structure les propriétés suivantes :

- famille de police ;
- taille ;
- graisse ;
- hauteur de ligne ;
- espacement des lettres.

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

Utilisez le contrôle **Light / Dark** pour afficher le mode clair ou sombre.

Le contrôle fonctionne comme une sélection exclusive et prend en charge les flèches du clavier.

## 11.3 Modifier un mapping

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

Modifiez :

- le nom du composant ;
- son statut : Draft, Ready ou Deprecated.

Utilisez Ready uniquement lorsque les informations nécessaires ont été revues.

## 12.4 Contenu localisé

Choisissez la langue de contenu française ou anglaise, puis renseignez :

- la finalité du composant ;
- les recommandations d’usage ;
- les recommandations de contenu.

Le sélecteur de langue de cette section ne change pas la langue générale de l’application.

## 12.5 Anatomie

L’anatomie décrit les parties internes du composant.

Chaque partie comprend :

- une clé technique ;
- un libellé localisé ;
- un niveau d’exigence : required, optional ou derived.

Exemple pour un bouton :

```text
root — requis
label — requis
leadingIcon — facultatif
spinner — dérivé
```

## 12.6 Variantes, tailles et états

Chaque collection contient des clés techniques et, lorsque les détails sont développés, des libellés et descriptions localisés.

Exemples :

- variantes : `primary`, `secondary`, `danger` ;
- tailles : `sm`, `md`, `lg` ;
- états : `default`, `hover`, `focusVisible`, `disabled`, `loading`.

Pour un composant interactif, documentez explicitement l’état `focusVisible`. Son absence peut être signalée dans Accessibility.

## 12.7 Règles d’accessibilité

Ajoutez des règles avec :

- une clé ;
- une sévérité : info, warning ou critical ;
- une description localisée.

Exemples :

```text
keyboardActivation — critical
focusVisible — critical
accessibleName — warning
```

Un composant interactif sans règle d’accessibilité peut être signalé.

## 12.8 Usages interdits

Les forbidden patterns décrivent ce qu’il ne faut pas faire avec le composant.

Exemple :

```text
Ne pas utiliser un bouton désactivé comme seul moyen d’expliquer une erreur.
Ne pas employer un bouton danger pour une action réversible et anodine.
```

## 12.9 Visual Tokens

Les bindings visuels associent le composant à des tokens existants.

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

Sélectionnez une langue prise en charge par le projet.

Si le projet ne prend en charge qu’une langue, le contrôle devient informatif.

L’application affiche le nombre de traductions manquantes utilisées avec fallback.

## 14.2 Choisir les sections

Les sections disponibles sont :

- Overview ;
- Tokens ;
- Themes ;
- Components ;
- Accessibility.

Activez ou désactivez chaque section. Au moins une section doit être sélectionnée pour générer une prévisualisation utile.

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

Sélectionnez une langue prise en charge par le projet. Les traductions manquantes et fallbacks sont signalés.

## 15.2 Choisir la sévérité des consignes

Trois niveaux sont disponibles :

- **Balanced** ;
- **Strict** ;
- **Very strict**.

Un niveau plus strict formule des contraintes plus impératives pour le consommateur du fichier.

## 15.3 Choisir les sections

Les sections sont :

- règles de tokens ;
- règles de composants ;
- règles d’accessibilité ;
- patterns interdits.

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

Choisissez une carte de format. L’aperçu affiche le contenu correspondant, son nom de fichier et ses informations principales.

## 16.2 Inclure les éléments dépréciés

Le contrôle **Include deprecated / Inclure les éléments dépréciés** détermine si les données marquées Deprecated doivent apparaître dans les formats compatibles.

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

Pour confirmer, saisissez exactement le nom du projet affiché.

Après suppression, l’application revient au Dashboard avec une confirmation.

> N’exécutez ce scénario que sur un projet jetable. L’action est irréversible.

---

## 18. Paramètres du compte

Les paramètres du compte sont accessibles depuis le menu utilisateur sur desktop ou le menu burger sur les écrans plus étroits.

## 18.1 Informations personnelles

Vous pouvez modifier :

- le nom affiché ;
- l’adresse e-mail de connexion.

Une modification du nom ne nécessite pas de mot de passe.

Une modification de l’e-mail :

- nécessite le mot de passe actuel ;
- refuse une adresse déjà utilisée ;
- déconnecte le compte après succès ;
- impose de se reconnecter avec la nouvelle adresse.

## 18.2 Langue

Choisissez français ou anglais, puis enregistrez.

Après sauvegarde, la route équivalente s’ouvre dans la langue choisie.

## 18.3 Apparence

Choisissez :

- System ;
- Light ;
- Dark.

L’apparence est prévisualisée immédiatement, puis persistée avec Save.

## 18.4 Supprimer le compte

La suppression permanente exige :

- l’adresse e-mail exacte du compte ;
- le mot de passe actuel.

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
