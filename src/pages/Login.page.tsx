import {
  Container,
  Paper,
  Text,
  Title
} from '@mantine/core';

import DBLogin from "@/components/DBLogin/DBLogin";

export function LoginPage() {
  return (
    <Container size={480} my={100}>
      <Title ta="center">
        DMS
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Document Management Service
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <DBLogin />
      </Paper>
    </Container>
  );
}
