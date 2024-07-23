1. 파라미터화된 쿼리의 사용
 SQL 인젝션 공격을 방지하는 데 효과적인 기법. 
->사용자 입력을 쿼리의 일부로 직접 조합하는 대신, 사용자 입력을 별도의 매개변수로 전달하고 데이터베이스가 이를 안전하게 처리
(id=?는 플레이스홀더로, queryData.id의 값이 안전하게 쿼리에 삽입됩니다. [queryData.id]는 이 플레이스홀더에 대입되며, SQL 쿼리의 나머지 부분과 분리되어 처리)
 SQL 인젝션은 악의적인 사용자가 SQL 쿼리에 입력값을 조작하여 데이터베이스를 비정상적으로 조작하거나 민감한 정보를 노출시킬 수 있는 보안 취약점이다.

 db.query(SELECT * FROM topic WHERE id=?,[queryData.id], function(error2, topic){
           if(error2){
             throw error2;
           }
           //id=? -> [queryData.id]가 ?에 치환되서 reload시 나쁜 의도 접근 막음 이 내용이 무슨 내용인지 모르겠어

