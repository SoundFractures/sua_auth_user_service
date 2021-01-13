const Auth = require('./services/auth')
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZmVjZjY3ZTA5ZTIwN2RjNDZlYTQ0OCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYxMDUzNDgxMX0.TVmySXFwdsRDG7gjoIDJhxWUPvaFqVUgGMIas1KGBns'
test('the checkUserToken fails with token invalid', async () => {
    const req= {
        body: {
            token: 123
        }
    }
  await expect(Auth.checkUserToken(req)).rejects.toBe('Token invalid');
});

test('the checkUserToken fails with token not found', async () => {
  const req= {
      body: {
      }
  }
await expect(Auth.checkUserToken(req)).rejects.toBe('Token not found');
});

test('the checkUserToken token is OK, method returns ID of user', async () => {
  const req= {
      body: {
        token: token
      }
  }
await expect(Auth.checkUserToken(req)).resolves.toBe('5ffecf67e09e207dc46ea448');
});