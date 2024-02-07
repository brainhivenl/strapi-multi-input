import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import debounce from 'lodash/debounce'
import React, { useMemo, useState, useCallback } from 'react'
import { Flex } from '@strapi/design-system/Flex'
import { ReactTags } from 'react-tag-autocomplete'
import { Field, FieldError, FieldHint, FieldLabel } from '@strapi/design-system/Field'

import './style.css'

const MultiInput = ({
  value,
  onChange,
  name,
  intlLabel,
  hint,
  required,
  attribute,
  labelAction,
  error,
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [controller, setController] = useState(null)
  const { options } = attribute
  const { formatMessage } = useIntl()
  const sanitizedValue = useMemo(() => {
    let parsedValue

    try {
      parsedValue = JSON.parse(value || '[]')
    } catch (e) { }

    return (parsedValue || [])
  }, [value])
  const selected = sanitizedValue.map(tag => ({ label: tag, value: tag }))

  function change(tag) {
    if (!options.suggestEndpoint) {
      return
    }

    if (controller !== null) {
      controller.abort()
    }

    const newController = new AbortController()

    setController(newController)
    fetchSuggestions(newController.signal, tag)
  }

  const changeDebounced = useCallback(debounce(change, 150), [controller])

  function addTag(tag) {
    onChange({
      target: {
        name: name,
        value: JSON.stringify([...sanitizedValue, tag.value]),
        type: attribute.type,
      },
    })
  }

  function deleteTag(idx) {
    onChange({
      target: {
        name: name,
        value: JSON.stringify(sanitizedValue.filter((_, index) => index !== idx)),
        type: attribute.type,
      },
    })
  }

  async function fetchSuggestions(signal, tag) {
    try {
      const headers = {}

      if (options.suggestAuthenticated) {
        const token = JSON.parse(localStorage.getItem('jwtToken'))
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${options.suggestEndpoint}?tag=${tag}`, {
        signal,
        headers
      })

      if (!response.ok) {
        console.warn(`failed to fetch suggestions: HTTP ${response.status}`)
        return
      }

      const result = await response.json()

      setSuggestions(result)
    } catch (e) {
      console.error("failed to fetch suggestions", e)
      return
    }
  }

  return (
    <Field hint={hint} error={error} required={required}>
      <Flex direction="column" alignItems="stretch" gap={1}>
        <FieldLabel action={labelAction}>
          {formatMessage(intlLabel)}
        </FieldLabel>
        <ReactTags
          onAdd={addTag}
          onInput={changeDebounced}
          onDelete={deleteTag}
          allowNew={true}
          allowBackspace={true}
          delimiterKeys={['Enter', ',']}
          selected={selected}
          suggestions={suggestions}
        />
        <FieldHint />
        <FieldError />
      </Flex>
    </Field>
  )
}

MultiInput.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: '',
}

MultiInput.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
}

export default MultiInput
