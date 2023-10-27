import { prefixPluginTranslations } from '@strapi/helper-plugin'
import pluginId from './pluginId'
import MultiInputIcon from './components/MultiInputIcon'
import getTrad from './utils/getTrad'

export default {
  register(app) {
    app.customFields.register({
      name: 'multi-input',
      pluginId: 'multi-input',
      type: 'json',
      icon: MultiInputIcon,
      intlLabel: {
        id: getTrad('multi-input.label'),
        defaultMessage: 'Multi Input',
      },
      intlDescription: {
        id: getTrad('multi-input.description'),
        defaultMessage: 'Input multiple options from a list',
      },
      components: {
        Input: async () => import('./components/MultiInput'),
      },
      options: {
        base: [
          {
            sectionTitle: null,
            items: [
              {
                name: "options.suggestEndpoint",
                type: "string",
                intlLabel: {
                  id: 'multi-input.form.suggestEndpoint.label',
                  defaultMessage: 'Suggestion HTTP endpoint'
                },
                description: {
                  id: 'multi-input.form.suggestEndpoint.description',
                  defaultMessage: 'The endpoint must return a JSON array of strings.'
                },
              },
              {
                name: "options.suggestAuthenticated",
                type: "checkbox",
                intlLabel: {
                  id: 'multi-input.form.suggestAuthenticated.label',
                  defaultMessage: 'Suggestion endpoint requires authentication'
                },
                description: {
                  id: 'multi-input.form.suggestAuthenticated.description',
                  defaultMessage: 'If checked, the suggestion endpoint will be called with the current user\'s credentials.'
                },
              }
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'form.attribute.item.requiredField.description',
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    })
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return Promise.all([import(`./translations/${locale}.json`)])
          .then(([pluginTranslations]) => {
            return {
              data: {
                ...prefixPluginTranslations(
                  pluginTranslations.default,
                  pluginId,
                ),
              },
              locale,
            }
          })
          .catch(() => {
            return {
              data: {},
              locale,
            }
          })
      }),
    )
    return Promise.resolve(importedTrads)
  },
}
