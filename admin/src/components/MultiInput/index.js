import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import React, { useMemo } from 'react'
import { TagsInput } from 'react-tag-input-component'
import { Flex } from '@strapi/design-system/Flex';
import { Field, FieldError, FieldHint, FieldLabel } from '@strapi/design-system/Field';

import "./style.css";

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
  const { formatMessage } = useIntl()
  const sanitizedValue = useMemo(() => {
    let parsedValue
    try {
      parsedValue = JSON.parse(value || '[]')
    } catch (e) {
      parsedValue = []
    }
    return parsedValue
  }, [value])

  return (
    <Field hint={hint} error={error} required={required}>
      <Flex direction="column" alignItems="stretch" gap={1}>
        <FieldLabel action={labelAction}>
          {formatMessage(intlLabel)}
        </FieldLabel>
        <TagsInput
          value={sanitizedValue}
          separators={["Enter", ","]}
          onChange={(v) => {
            onChange({
              target: {
                name: name,
                value: JSON.stringify(v.filter(Boolean)),
                type: attribute.type,
              },
            })
          }}
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
