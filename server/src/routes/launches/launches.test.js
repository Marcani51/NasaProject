const request=require('supertest');
////perlu include app.js yg merupakan isian dari supertest memintaa app
const app=require('../../app');

describe('Test GET /launches',()=>{
  test('it should responce with 200 success',()=>{
    const responce=request(app);
    expect(responce).toBe(200);
  });
});

describe('Test Post /launch',()=>{
  test('it should responce with 200 success', () => { 
    
  });

  test('it should catch missing required properties', () => { 
    
  });
  test('it should catch invalid date', () => { 
    
  });
});