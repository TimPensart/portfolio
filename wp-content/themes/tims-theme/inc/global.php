<?php

namespace Tim\Theme\Global;

/**
 * function to strip phonenumbers
 *
 * include in page where to use this function: use Tim\Theme\Global;
 * call function: Global\strip_tel('string' or get_field('field_name', post_id));
 *
 * @param bool|string $phone_number Inital phone number
 *
 * @return string
 */
function strip_tel(bool|string $phone_number = false): string
{
    $phone_number = str_replace(['(', ')', '-', '.', '|', '/', ' '], '', $phone_number);
    return esc_attr('tel:' . $phone_number);
}

/**
 * Usage:
 * include in page where to use this function: use Tim\Theme\Global;
 * function to check if multidimensional array items are empty
 *
 * call function: Global\is_array_empty($array)
 *
 * @param array $_data
 * @return boolean
 */
function is_array_empty(array $_data): mixed
{
    if (empty($_data)) {
        return true;
    }
    $_is_empty = true;
    array_walk_recursive(
        $_data,
        function ($value, $key) use (&$_is_empty) {
            if ($value) {
                $_is_empty = false;
                return;
            }
        }
    );
    return $_is_empty;
}
