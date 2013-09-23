<?php
if (isset($form['webform_steps']))
  print drupal_render($form['webform_steps']);
print drupal_render($form['submitted']);
print drupal_render_children($form);

