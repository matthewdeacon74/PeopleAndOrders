// Q1: avg age
db.people.aggregate([{ 
	$group: {
	   _id: null,
	   average: { $avg: '$age' }
	} 
}]);


// Q2: avg age by gender
db.people.aggregate([{ 
	$group: {
	   _id: '$gender',
	   average: { $avg: '$age' }
	} 
}]);


// Q3 number of people by gender
db.people.aggregate([{ 
	$group: {
	   _id: '$gender',
	   number: { $sum: 1 }
	} 
}]);


// Q4: 3 oldest people
db.people.aggregate([
	{ 
		$sort: {
			age: -1
		} 
	},
	{
		$limit: 3
	}
]);

// Q5 3: youngest people
db.people.aggregate([
	{ 
		$sort: {
			age: 1
		} 
	},
	{
		$limit: 5
	},
	{
		$project: {
			fullName: {$concat: ['$first_name', ' ', '$last_name']},
			age: 1, 
			_id: 0
		}
	}
]);

// Q6: avg # of children
db.people.aggregate([{ 
	$group: {
	  _id: null,
	   averageChildren: { $avg: {$size: '$children'} }
	} 
}]);

// Q7: name/age of kids in MI under age 10
db.people.aggregate([
	{
		$unwind: '$children'
	},
	{
		$match: {state: 'Michigan', 'children.age': {$lt: 10}}
	},
	{
		$project: {_id:0, childName: '$children.name', childAge: '$children.age'}
	}
]);

// Q8: Average age of child by state, sorted with oldest first
db.people.aggregate([
	{
		$unwind: '$children'
	},
	{
		$group: {_id: '$state', avgChildAge: {$avg: '$children.age' }}
	},
	{
		$sort: {avgAge: -1}
	}
]);

//Q9: total of all sales
db.orders.aggregate([
  {
    $group: {
      _id: null,
      totalSales: { $sum: "$total" }
    }
  }
]);

// Q10: total dollar amount of sales on 2017-05-22
db.orders.aggregate([
  {
    $match: {date: '2017-05-22'}
  },
  {
    $group: {
      _id: null,
      totalSales: { $sum: "$total" }
    }
  }
]);

// Q11: date with the greatest number of orders
db.orders.aggregate([
  {
    $group: {
      _id: '$date',
      numOrders: {$sum: 1}
    }
  },
  {
    $sort: {numOrders: -1}
  },
  {
    $limit: 1
  },
  {
    $project: {_id:0, date: '$_id', numOrders: 1}
  }
]);


// Q12: date with the greatest total sales
db.orders.aggregate([
  {
    $group: {
      _id: '$date',
      totalSales: {$sum: '$total'}
    }
  },
  {
    $sort: {totalSales: -1}
  },
  {
    $limit: 1
  },
  {
    $project: {_id:0, date: '$_id', totalSales: 1}
  }
]);

// Q13: top three products that have had the greatest number sold
db.orders.aggregate([
  {
    $unwind: '$items'
  },
  {
    $group: {
      _id: '$items.product',
      numSold: {$sum: '$items.count'}
    }
  },
  {
    $sort: {numSold: -1}
  },
  {
    $limit: 3
  },
  {
    $project: {_id:1, totalSales: '$numSold'}
  }
]);

// Q14: top item that has the greatest revenue
db.orders.aggregate([
  {
    $unwind: '$items'
  },
  {
    $project: {
      product: '$items.product',
      revenue: {$multiply: ['$items.count', '$items.price']}
    }
  },
  {
    $group: {
      _id: '$product',
      totalRevenue: {$sum: '$revenue'}
    }
  },
  {
    $sort: {totalRevenue: -1}
  },
  {
    $limit: 1
  },
  {
    $project: {_id:1, totalRevenue: 1}
  }
]);

