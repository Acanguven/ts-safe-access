import * as ts from 'typescript';
import {SyntaxKind} from 'typescript';

const isSafeAccessParent = (node: ts.Node): boolean => {
  // by default ? is for conditional expressions
  return node.kind === SyntaxKind.ConditionalExpression &&

    // Check if it is really valid conditional expression
    !isValidConditionalExpression(node) &&

    node.getChildren().some((child: ts.Node, i: number) => {
      const nextNode = node.getChildAt(i + 1);
      const prevNode = node.getChildAt(i - 1);


      // We expect Question Token Before Property Access
      return child.kind === SyntaxKind.QuestionToken &&

        // Next Node should be access expression or conditional expressions, and you have to check if it is valid condition or not
        (nextNode.kind === SyntaxKind.PropertyAccessExpression || nextNode.kind === SyntaxKind.ConditionalExpression) &&

        // Left Node should be identifier or property access
        (prevNode.kind === SyntaxKind.PropertyAccessExpression || prevNode.kind === SyntaxKind.Identifier)
    })
};

const isValidConditionalExpression = (node: ts.Node) => {
  return node.getChildren().some((child: ts.Node, i: number) => {
    const secondNextNode = node.getChildAt(i + 2);

    return child.kind === SyntaxKind.QuestionToken && secondNextNode.kind === SyntaxKind.ColonToken && secondNextNode.getFullText() === ':';
  });
};


const convertConditionalToSafeAccess = (node: ts.Node) => {
  const accessList = node
    .getFullText()
    .split('?')
    .map(str => str.split('.').filter(c => c.length > 0))
  // .map(str => ({prop: str, node: listToAccessNode(str)}));

  let securedAccess = ts.createPropertyAccess(
    createSafeParenthesisNode(listToAccessNode(accessList[0])),
    accessList[1][0]
  );

  for (let x = 2, len = accessList.length; x < len; x++) {
    for (let i = 0, iLen = accessList[x].length; i < iLen; i++) {
      securedAccess = ts.createPropertyAccess(
        i === 0 ?
          createSafeParenthesisNode(securedAccess) :
          securedAccess,
        accessList[x][i]
      )
    }
  }

  return securedAccess;
};

const createSafeParenthesisNode = (node: ts.PropertyAccessExpression | ts.Identifier | ts.ParenthesizedExpression) => {
  return ts.createParen(
    ts.createBinary(
      node,
      ts.createToken(ts.SyntaxKind.BarBarToken),
      ts.createObjectLiteral([], false)
    )
  )
};


const listToAccessNode = (accessList: string[]) => {
  if (accessList.length < 2) return ts.createIdentifier(accessList[0]);

  let propertyAccessor = ts.createPropertyAccess(
    ts.createIdentifier(accessList[0]),
    ts.createIdentifier(accessList[1]),
  );

  if (accessList.length === 2) return propertyAccessor;

  for (let x = 2, len = accessList.length; x < len; x++) {
    propertyAccessor = ts.createPropertyAccess(
      propertyAccessor,
      ts.createIdentifier(accessList[x])
    )
  }

  return propertyAccessor;
};

function safeAccessor<T extends ts.Node>(): ts.TransformerFactory<T> {
  return (context) => {
    const visit: ts.Visitor = (node) => {

      if (isSafeAccessParent(node)) {
        return ts.visitEachChild(convertConditionalToSafeAccess(node), (child) => (visit as any)(child, true), context);
      }

      return ts.visitEachChild(node, (child) => visit(child), context);
    };

    return (node) => ts.visitNode(node, visit);
  };
}

export = safeAccessor;
