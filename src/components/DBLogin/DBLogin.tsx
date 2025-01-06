import { useEffect, useState } from 'react';

import { Button, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';



function get_token_endpoint(): string {
  const base_url = import.meta.env.VITE_BASE_URL

  if (base_url) {
    return `${base_url}/api/auth/token`
  }

  return `/api/auth/token`
}

function get_redirect_endpoint() {
  const base_url = window.location.origin; // get current baseUrl

  if (base_url) {
    return `${base_url}/`;
  }

  return `/`;
}


export default function Login() {
  const [error, setError] = useState<string>()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { username: '', password: '' },
  });
  const [submittedValues, setSubmittedValues] = useState<typeof form.values | null>(null);

  useEffect(() => {
    if (submittedValues?.password && submittedValues.username) {
      let provider = 'db';
      const username = submittedValues?.username
      const password = submittedValues?.password
      let body = JSON.stringify({ username, password, provider });
      fetch(
        get_token_endpoint(),
        {
          method: 'POST',
          body: body,
          headers: {
            "Content-Type": "application/json",
          },

        },

      )
        .then(response => {
          if (response.status != 200) {
            setError(response.statusText);
            response.json().then(result =>
              setError(result?.detail || 'Unauthorized'));
          } else {
            response.json().then(result => {
              document.cookie = `access_token=${result.access_token}; path=/`;
              let a = document.createElement('a');
              a.href = get_redirect_endpoint();
              a.click();
            });
          }
        }
        ).catch(error => {
          console.log(`There was an error ==='${error}'===`);
        });
    }
  }, [submittedValues?.username, submittedValues?.password])

  return (
    <form onSubmit={form.onSubmit(setSubmittedValues)}>
      <TextInput
        {...form.getInputProps('username')}
        key={form.key('username')}
        label="Username"
        placeholder="username"
        required />
      <PasswordInput
        {...form.getInputProps('password')}
        key={form.key('password')}
        label="Password"
        placeholder="Your password"
        required mt="md" />
      <Button fullWidth mt="xl" type="submit">
        Sign in
      </Button>
      <Text my={"md"} c="red">
        {error}
      </Text>
    </form>
  );
}
