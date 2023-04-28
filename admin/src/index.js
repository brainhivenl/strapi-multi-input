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
                name: 'options',
                type: 'textarea-enum',
                intlLabel: {
                  id: getTrad('multi-input.enum.label'),
                  defaultMessage: 'Options (one per line)',
                },
                description: {
                  id: getTrad('multi-input.enum.description'),
                  defaultMessage:
                    'Enter one option per line. You can also add a value and a label separated by a colon (e.g. "label:value").\nIf no value is provided, the label will be used as the value.',
                },
                placeholder: {
                  id: getTrad('multi-input.enum.placeholder'),
                  defaultMessage: 'Ex:\nOption 1\nOption 2\nOption 3:option-3',
                },
              },
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
