import json
from pathlib import Path

COPY = {
    "en": {
        "PasswordRecoveryRequestPage": {
            "backToLogin": "Back to sign in",
            "benefits": {
                "title": "Secure account recovery",
                "items": {
                    "neutral": "The response never reveals whether an account exists.",
                    "singleUse": "Recovery links expire after 30 minutes and work only once.",
                    "sessions": "A completed reset invalidates existing sessions."
                }
            },
            "description": "Enter your account email. We will send recovery instructions when the address is eligible.",
            "eyebrow": "Account recovery",
            "form": {
                "emailLabel": "Account email",
                "submit": "Send recovery instructions",
                "submitPending": "Submitting..."
            },
            "submitted": "When an eligible account matches this address, recovery instructions will arrive shortly.",
            "title": "Forgot your password?",
            "validation": {
                "emailInvalid": "Enter a valid email address."
            }
        },
        "PasswordResetPage": {
            "actions": {
                "backToLogin": "Back to sign in",
                "requestNewLink": "Request a new recovery link",
                "signIn": "Sign in with the new password"
            },
            "eyebrow": "Account recovery",
            "form": {
                "passwordConfirmationLabel": "Confirm new password",
                "passwordHelp": "Use at least 15 characters. Passphrases and spaces are allowed.",
                "passwordLabel": "New password",
                "passwordVisibility": {
                    "hide": "Hide password",
                    "show": "Show password"
                },
                "submit": "Reset password",
                "submitPending": "Resetting..."
            },
            "states": {
                "confirm": {
                    "description": "Choose a new password for your VulcanForgeUI account.",
                    "title": "Choose a new password"
                },
                "expired": {
                    "description": "This recovery link has expired. Request a new link to continue.",
                    "title": "Recovery link expired"
                },
                "invalid": {
                    "description": "This recovery link is invalid, replaced or already used.",
                    "title": "Recovery link unavailable"
                },
                "pending": {
                    "description": "Open the latest recovery link from your email to continue.",
                    "title": "Check your email"
                },
                "reset": {
                    "description": "Your password has been changed and existing sessions have been invalidated.",
                    "title": "Password changed"
                }
            },
            "validation": {
                "passwordCheckUnavailable": "Password safety checks are temporarily unavailable. Try again later.",
                "passwordCompromised": "Choose a password that has not appeared in known data breaches.",
                "passwordConfirmationMismatch": "The password confirmation does not match.",
                "passwordHashingUnavailable": "Secure password storage is temporarily unavailable. Try again later.",
                "passwordInvalidUnicode": "The password contains unsupported Unicode characters.",
                "passwordMinLength": "Use at least 15 characters.",
                "passwordTooLong": "Use no more than 128 characters.",
                "rateLimited": "Too many attempts. Wait before trying again.",
                "unexpected": "We could not reset the password. Try again later."
            }
        },
        "forgotPassword": "Forgot password?"
    },
    "fr": {
        "PasswordRecoveryRequestPage": {
            "backToLogin": "Retour à la connexion",
            "benefits": {
                "title": "Récupération sécurisée du compte",
                "items": {
                    "neutral": "La réponse ne révèle jamais si un compte existe.",
                    "singleUse": "Les liens expirent après 30 minutes et ne fonctionnent qu’une fois.",
                    "sessions": "Une réinitialisation invalide les sessions existantes."
                }
            },
            "description": "Saisissez l’adresse e-mail du compte. Nous enverrons les instructions lorsque l’adresse est éligible.",
            "eyebrow": "Récupération du compte",
            "form": {
                "emailLabel": "Adresse e-mail du compte",
                "submit": "Envoyer les instructions",
                "submitPending": "Envoi..."
            },
            "submitted": "Lorsqu’un compte éligible correspond à cette adresse, les instructions arriveront prochainement.",
            "title": "Mot de passe oublié ?",
            "validation": {
                "emailInvalid": "Saisissez une adresse e-mail valide."
            }
        },
        "PasswordResetPage": {
            "actions": {
                "backToLogin": "Retour à la connexion",
                "requestNewLink": "Demander un nouveau lien",
                "signIn": "Se connecter avec le nouveau mot de passe"
            },
            "eyebrow": "Récupération du compte",
            "form": {
                "passwordConfirmationLabel": "Confirmer le nouveau mot de passe",
                "passwordHelp": "Utilisez au moins 15 caractères. Les phrases de passe et les espaces sont autorisés.",
                "passwordLabel": "Nouveau mot de passe",
                "passwordVisibility": {
                    "hide": "Masquer le mot de passe",
                    "show": "Afficher le mot de passe"
                },
                "submit": "Réinitialiser le mot de passe",
                "submitPending": "Réinitialisation..."
            },
            "states": {
                "confirm": {
                    "description": "Choisissez un nouveau mot de passe pour votre compte VulcanForgeUI.",
                    "title": "Choisissez un nouveau mot de passe"
                },
                "expired": {
                    "description": "Ce lien de récupération a expiré. Demandez un nouveau lien pour continuer.",
                    "title": "Lien de récupération expiré"
                },
                "invalid": {
                    "description": "Ce lien est invalide, remplacé ou déjà utilisé.",
                    "title": "Lien de récupération indisponible"
                },
                "pending": {
                    "description": "Ouvrez le dernier lien de récupération reçu par e-mail pour continuer.",
                    "title": "Consultez votre e-mail"
                },
                "reset": {
                    "description": "Votre mot de passe a été modifié et les sessions existantes ont été invalidées.",
                    "title": "Mot de passe modifié"
                }
            },
            "validation": {
                "passwordCheckUnavailable": "La vérification de sécurité est temporairement indisponible. Réessayez plus tard.",
                "passwordCompromised": "Choisissez un mot de passe absent des fuites de données connues.",
                "passwordConfirmationMismatch": "La confirmation ne correspond pas au mot de passe.",
                "passwordHashingUnavailable": "Le stockage sécurisé est temporairement indisponible. Réessayez plus tard.",
                "passwordInvalidUnicode": "Le mot de passe contient des caractères Unicode non pris en charge.",
                "passwordMinLength": "Utilisez au moins 15 caractères.",
                "passwordTooLong": "Utilisez au maximum 128 caractères.",
                "rateLimited": "Trop de tentatives. Patientez avant de réessayer.",
                "unexpected": "La réinitialisation a échoué. Réessayez plus tard."
            }
        },
        "forgotPassword": "Mot de passe oublié ?"
    }
}

for locale in ("en", "fr"):
    path = Path(f"src/messages/{locale}.json")
    data = json.loads(path.read_text(encoding="utf-8"))
    locale_copy = COPY[locale]
    data["PasswordRecoveryRequestPage"] = locale_copy["PasswordRecoveryRequestPage"]
    data["PasswordResetPage"] = locale_copy["PasswordResetPage"]
    data["LoginPage"]["form"]["forgotPassword"] = locale_copy["forgotPassword"]
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

login_path = Path("src/features/auth/login/LoginForm.tsx")
login = login_path.read_text(encoding="utf-8")
login = login.replace(
    "import { Button, Input } from '@/components/ui';",
    "import { AppLink } from '@/components/navigation/AppLink';\nimport { Button, Input } from '@/components/ui';",
)
needle = """        {passwordError ? (
          <p id=\"password-error\" className=\"text-action-danger mt-2 text-sm\">
            {t(`validation.${passwordError}`)}
          </p>
        ) : null}
      </div>

      <Button"""
replacement = """        {passwordError ? (
          <p id=\"password-error\" className=\"text-action-danger mt-2 text-sm\">
            {t(`validation.${passwordError}`)}
          </p>
        ) : null}
        <div className=\"mt-3 text-right\">
          <AppLink
            href=\"/forgot-password\"
            className=\"text-action-accent text-sm font-semibold\"
          >
            {t('form.forgotPassword')}
          </AppLink>
        </div>
      </div>

      <Button"""
if needle not in login:
    raise SystemExit("Login password block not found")
login_path.write_text(login.replace(needle, replacement), encoding="utf-8")
